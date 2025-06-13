import type { Meta, StoryObj } from '@storybook/react-vite';
import { VirtualList } from './VirtualList';
import { useState, useRef } from 'react';

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate a large dataset
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: `This is the description for item ${i + 1}`,
    height: Math.floor(Math.random() * 3) + 1, // Random height multiplier (1, 2, or 3)
    color: `hsl(${(i * 25) % 360}, 70%, 80%)` // Different color for each item
  }));
};

// Basic example with fixed height items
const BasicExample = () => {
  const items = generateItems(1000);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Basic VirtualList Example</h3>
      <p>This list contains 1,000 items but only renders the visible ones:</p>
      
      <div style={{ marginTop: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
        <VirtualList
          items={items}
          height={400}
          estimatedItemHeight={50}
        >
          {(item, index) => (
            <div
              key={item.id}
              style={{
                padding: '15px',
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                borderBottom: '1px solid #eee'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div>{item.description}</div>
            </div>
          )}
        </VirtualList>
      </div>
      
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> Try scrolling through the list. Even though there are 1,000 items, only the visible ones are actually rendered in the DOM, which improves performance.</p>
      </div>
    </div>
  );
};

// Example with variable height items
const VariableHeightExample = () => {
  const items = generateItems(500);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Variable Height Example</h3>
      <p>This example shows how VirtualList handles items with different heights:</p>
      
      <div style={{ marginTop: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
        <VirtualList
          items={items}
          height={400}
          estimatedItemHeight={70}
          overscan={10}
        >
          {(item, index) => (
            <div
              key={item.id}
              style={{
                padding: '15px',
                backgroundColor: item.color,
                borderBottom: '1px solid #eee',
                height: `${item.height * 50}px` // Variable height based on the item
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div>{item.description}</div>
              {item.height > 1 && (
                <div style={{ marginTop: '10px' }}>
                  <p>This is a taller item (height factor: {item.height})</p>
                  {item.height > 2 && (
                    <p>This item has even more content because it's very tall!</p>
                  )}
                </div>
              )}
            </div>
          )}
        </VirtualList>
      </div>
      
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The VirtualList component measures the actual height of each rendered item and adjusts its calculations accordingly.</p>
      </div>
    </div>
  );
};

// Example with scroll to index functionality
const ScrollToIndexExample = () => {
  const items = generateItems(1000);
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined);
  const [indexInput, setIndexInput] = useState('');
  
  const handleScrollToIndex = () => {
    const index = parseInt(indexInput, 10);
    if (!isNaN(index) && index >= 0 && index < items.length) {
      setScrollToIndex(index);
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Scroll To Index Example</h3>
      <p>This example demonstrates how to scroll to a specific item by index:</p>
      
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <input
          type="number"
          min="0"
          max={items.length - 1}
          value={indexInput}
          onChange={(e) => setIndexInput(e.target.value)}
          placeholder="Enter index (0-999)"
          style={{ padding: '8px', width: '150px' }}
        />
        <button
          onClick={handleScrollToIndex}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Scroll to Index
        </button>
      </div>
      
      <div style={{ marginTop: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
        <VirtualList
          items={items}
          height={400}
          estimatedItemHeight={50}
          scrollToIndex={scrollToIndex}
        >
          {(item, index) => (
            <div
              key={item.id}
              style={{
                padding: '15px',
                backgroundColor: scrollToIndex === index ? '#e6f7ff' : (index % 2 === 0 ? '#f9f9f9' : 'white'),
                borderBottom: '1px solid #eee',
                borderLeft: scrollToIndex === index ? '4px solid #1890ff' : 'none'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                {item.title} {scrollToIndex === index && '(Scrolled to this item)'}
              </div>
              <div>{item.description}</div>
            </div>
          )}
        </VirtualList>
      </div>
      
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> Enter an index between 0 and 999 and click the button to scroll to that item.</p>
      </div>
    </div>
  );
};

// Example with dynamic content and controls
const DynamicExample = () => {
  const [itemCount, setItemCount] = useState(500);
  const [listHeight, setListHeight] = useState(400);
  const [overscan, setOverscan] = useState(5);
  const [items, setItems] = useState(() => generateItems(itemCount));
  
  const regenerateItems = () => {
    setItems(generateItems(itemCount));
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '600px' }}>
      <h3>Dynamic VirtualList Example</h3>
      <p>This example allows you to adjust various parameters of the VirtualList:</p>
      
      <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Item Count:</label>
          <input
            type="number"
            min="10"
            max="10000"
            value={itemCount}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 10 && value <= 10000) {
                setItemCount(value);
                setItems(generateItems(value));
              }
            }}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>List Height (px):</label>
          <input
            type="number"
            min="100"
            max="800"
            value={listHeight}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 100 && value <= 800) {
                setListHeight(value);
              }
            }}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Overscan:</label>
          <input
            type="number"
            min="0"
            max="50"
            value={overscan}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 0 && value <= 50) {
                setOverscan(value);
              }
            }}
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={regenerateItems}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              width: '100%'
            }}
          >
            Regenerate Items
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
        <VirtualList
          items={items}
          height={listHeight}
          estimatedItemHeight={60}
          overscan={overscan}
        >
          {(item, index) => (
            <div
              key={item.id}
              style={{
                padding: '15px',
                backgroundColor: item.color,
                borderBottom: '1px solid #eee'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{item.title}</div>
              <div>{item.description}</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>
                Index: {index}, Height Factor: {item.height}
              </div>
            </div>
          )}
        </VirtualList>
      </div>
      
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> Try adjusting the parameters to see how the VirtualList behaves with different configurations.</p>
        <p><strong>Overscan</strong> is the number of extra items rendered above and below the visible area as a buffer for smoother scrolling.</p>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const VariableHeight: Story = {
  render: () => <VariableHeightExample />,
};

export const ScrollToIndex: Story = {
  render: () => <ScrollToIndexExample />,
};

export const Dynamic: Story = {
  render: () => <DynamicExample />,
};

export const WithDescription: Story = {
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story: `
The VirtualList component is a performance optimization helper that renders only the visible items in a long list, which is useful for efficiently rendering large lists of data.

\`\`\`tsx
import { VirtualList } from './components/VirtualList';

// Create an array of items
const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  title: \`Item \${i + 1}\`,
  description: \`Description for item \${i + 1}\`
}));

// Use the VirtualList component to render only the visible items
<VirtualList
  items={items}
  height={400}
  estimatedItemHeight={50}
  overscan={5}
>
  {(item, index) => (
    <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
      <div>{item.title}</div>
      <div>{item.description}</div>
    </div>
  )}
</VirtualList>
\`\`\`

The VirtualList component takes the following props:
- \`items\`: An array of items to render
- \`height\`: The fixed height of the list container
- \`estimatedItemHeight\`: An estimate of the height of each item (used for initial rendering)
- \`overscan\`: The number of items to render above and below the visible area (default: 5)
- \`scrollToIndex\`: Optional index to scroll to
- \`children\`: A render function that receives each item and its index

How it works:
1. The component creates a container with the specified height and overflow-y: auto
2. It calculates which items are visible in the current viewport based on scroll position
3. It only renders the visible items plus a buffer (overscan) above and below
4. It measures the actual heights of rendered items and adjusts its calculations
5. It positions the items absolutely within a container of the total height

Benefits:
- Significantly improves performance for large lists
- Reduces memory usage by only rendering what's needed
- Supports items with variable heights
- Provides smooth scrolling experience
- Allows programmatic scrolling to specific items

When to use VirtualList:
- When rendering large lists (hundreds or thousands of items)
- When rendering complex items that are expensive to create
- When you need to maintain smooth scrolling performance
- When memory usage is a concern
        `,
      },
    },
  },
};