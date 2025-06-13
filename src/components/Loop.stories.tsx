import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loop } from './Loop';
import { useState } from 'react';
import { createSignal } from '../core/createSignal';

const meta = {
  title: 'Components/Loop',
  component: Loop,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Loop>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Loop with static data
const LoopExample = () => {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Loop Component Example</h3>
      <div>
        <h4>Fruit List:</h4>
        <ul>
          <Loop each={() => fruits}>
            {(fruit, index) => (
              <li key={index}>
                {index + 1}. {fruit}
              </li>
            )}
          </Loop>
        </ul>
      </div>
    </div>
  );
};

// Example component that uses Loop with dynamic data
const DynamicLoopExample = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [newItem, setNewItem] = useState('');
  
  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };
  
  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Dynamic Loop Example</h3>
      <div>
        <input 
          type="text" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
          style={{ marginRight: '8px' }}
        />
        <button onClick={addItem}>Add</button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <h4>Items:</h4>
        <ul>
          <Loop each={() => items}>
            {(item, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {item}
                <button 
                  onClick={() => removeItem(index)}
                  style={{ marginLeft: '8px', fontSize: '12px' }}
                >
                  Remove
                </button>
              </li>
            )}
          </Loop>
        </ul>
      </div>
    </div>
  );
};

// Example component that uses Loop with a signal
const SignalLoopExample = () => {
  const [count, setCount] = createSignal(5);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Signal Loop Example</h3>
      <div>
        <button onClick={() => setCount(Math.max(1, count() - 1))}>-</button>
        <span style={{ margin: '0 10px' }}>Count: {count()}</span>
        <button onClick={() => setCount(count() + 1)}>+</button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <h4>Generated Numbers:</h4>
        <ul>
          <Loop each={() => Array.from({ length: count() }, (_, i) => i + 1)}>
            {(num, index) => (
              <li key={index}>
                Number {num} (index: {index})
              </li>
            )}
          </Loop>
        </ul>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <LoopExample />,
};

export const Dynamic: Story = {
  render: () => <DynamicLoopExample />,
};

export const WithSignal: Story = {
  render: () => <SignalLoopExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <LoopExample />
      <div style={{ height: '20px' }} />
      <SignalLoopExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Loop component is a helper for rendering lists of items.

\`\`\`tsx
import { Loop } from './components/Loop';

// Static array
const fruits = ['Apple', 'Banana', 'Cherry'];

// Use the Loop component to render a list
<ul>
  <Loop each={() => fruits}>
    {(fruit, index) => (
      <li key={index}>{fruit}</li>
    )}
  </Loop>
</ul>

// With signals
const [items, setItems] = createSignal(['Item 1', 'Item 2']);

<Loop each={items}>
  {(item, index) => (
    <div key={index}>{item}</div>
  )}
</Loop>
\`\`\`

The Loop component takes two props:
- \`each\`: A function that returns an array of items to render
- \`children\`: A render function that receives each item and its index

The component:
- Maps over the array returned by the \`each\` function
- Calls the \`children\` function for each item, passing the item and index
- Returns the results wrapped in a fragment
- Provides a cleaner alternative to using \`.map()\` directly in JSX
        `,
      },
    },
  },
};