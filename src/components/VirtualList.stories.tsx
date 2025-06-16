import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { VirtualList } from './VirtualList.tsx';
import { useSignal, useSignalValue } from '../hooks/useSignal';
import { createEffect } from '../core/signals';

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,
  parameters: {
    layout: 'fullscreen', // Use fullscreen for better viewing
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Helper to generate data ---
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i}`,
    description: `This is the description for item #${i}.`,
    // Give items variable heights for a more realistic scenario
    height: 28 + Math.floor(Math.random() * 60),
  }));
};

// --- Basic Example ---
const BasicExample = () => {
  const items = generateItems(1000);
  return (
    <div className="p-4 w-full h-screen flex flex-col items-center">
      <div className="w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Basic VirtualList</h3>
        <p className="text-sm text-gray-600 mb-4">Rendering 1,000 items with fixed estimated height. Only visible items are in the DOM.</p>
        <div className="border border-gray-300 rounded-lg h-[500px] overflow-hidden">
          <VirtualList items={items} height={500} estimatedItemHeight={50}>
            {(item, index) => (
              <div
                className={`p-3 border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                style={{ height: item.height }}
              >
                <div className="font-bold text-sm">{item.title}</div>
              </div>
            )}
          </VirtualList>
        </div>
      </div>
    </div>
  );
};

// --- Scroll To Index Example (using ref) ---
const ScrollToIndexExample = () => {
  const items = generateItems(1000);
  const listRef = useRef<any>(null); // Ref for the VirtualList component
  const [indexInput, setIndexInput] = useState('500');

  const handleScrollToIndex = () => {
    const index = parseInt(indexInput, 10);
    if (listRef.current && !isNaN(index) && index >= 0 && index < items.length) {
      // Call the scrollToIndex method via the ref
      listRef.current.scrollToIndex(index, { align: 'center' });
    }
  };

  return (
    <div className="p-4 w-full h-screen flex flex-col items-center">
      <div className="w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Scroll To Index (Ref)</h3>
        <p className="text-sm text-gray-600 mb-4">Programmatically scroll to an item using an imperative handle ref.</p>
        <div className="mb-4 flex gap-2">
          <input
            type="number"
            value={indexInput}
            onChange={(e) => setIndexInput(e.target.value)}
            className="p-2 border rounded-md w-full"
            placeholder={`Index (0-${items.length - 1})`}
          />
          <button onClick={handleScrollToIndex} className="p-2 px-4 bg-blue-500 text-white rounded-md font-semibold">
            Go
          </button>
        </div>
        <div className="border border-gray-300 rounded-lg h-[500px] overflow-hidden">
          <VirtualList ref={listRef} items={items} height={500} estimatedItemHeight={50}>
            {(item, index) => (
              <div
                className={`p-3 border-b border-gray-200 flex items-center`}
                style={{ height: item.height }}
              >
                <span className="font-mono text-xs text-gray-500 w-12">{index}</span>
                <span className="font-bold text-sm">{item.title}</span>
              </div>
            )}
          </VirtualList>
        </div>
      </div>
    </div>
  );
};


// --- Dynamic Example (using Signals) ---
const DynamicSignalExample = () => {
  const itemCount = useSignal(500);
  const items = useSignal(generateItems(itemCount.peek()));
  const listRef = useRef<any>(null);

  // A side-effect that re-generates the list when itemCount changes
  createEffect(() => {
    items.set(generateItems(itemCount.get()));
  });

  const handleScrollToRandom = () => {
    if (listRef.current) {
      const randomIndex = Math.floor(Math.random() * itemCount.peek());
      listRef.current.scrollToIndex(randomIndex, { align: 'center' });
    }
  };

  return (
    <div className="p-4 w-full h-screen flex flex-col items-center">
      <div className="w-full max-w-md">
        <h3 className="text-xl font-bold mb-2">Dynamic List (Signals)</h3>
        <p className="text-sm text-gray-600 mb-4">The list reactively updates when its underlying signal changes.</p>
        <div className="mb-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Count: {useSignalValue(itemCount)}</label>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={useSignalValue(itemCount)}
              onInput={(e) => itemCount.set(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button onClick={handleScrollToRandom} className="p-2 px-4 bg-green-500 text-white rounded-md font-semibold">
            Scroll to Random
          </post>
        </div>
        <div className="border border-gray-300 rounded-lg h-[500px] overflow-hidden">
          <VirtualList ref={listRef} items={items} height={500} estimatedItemHeight={50}>
            {(item, index) => (
              <div
                className={`p-3 border-b border-gray-200 flex items-center`}
                style={{ height: item.height }}
              >
                <span className="font-mono text-xs text-gray-500 w-12">{index}</span>
                <span className="font-bold text-sm">{item.title}</span>
              </div>
            )}
          </VirtualList>
        </div>
      </div>
    </div>
  );
};


export const Basic: Story = {
  name: "Basic Usage",
  render: () => <BasicExample />,
};

export const ScrollTo: Story = {
  name: "Imperative Scrolling (Ref)",
  render: () => <ScrollToIndexExample />,
};

export const WithSignals: Story = {
  name: "Dynamic with Signals",
  render: () => <DynamicSignalExample />,
};

