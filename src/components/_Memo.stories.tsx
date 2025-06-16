import type { Meta, StoryObj } from '@storybook/react-vite';
import { Memo } from './Memo';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/Memo',
  component: Memo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Memo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Memo for a simple computation
const SimpleMemoExample = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);
  const [renderCount, setRenderCount] = useState(0);
  
  // Increment render count on each render
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, [count, multiplier]);
  
  // Function to simulate an "expensive" computation
  const computeResult = () => {
    console.log('Computing result...');
    // Simulate expensive computation
    const startTime = performance.now();
    while (performance.now() - startTime < 10) {
      // Artificial delay to simulate work
    }
    return count * multiplier;
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Memo Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Count:</label>
          <button onClick={() => setCount(c => Math.max(0, c - 1))} style={{ marginRight: '5px' }}>-</button>
          <span style={{ margin: '0 10px' }}>{count}</span>
          <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
        
        <div>
          <label style={{ marginRight: '10px' }}>Multiplier:</label>
          <button onClick={() => setMultiplier(m => Math.max(1, m - 1))} style={{ marginRight: '5px' }}>-</button>
          <span style={{ margin: '0 10px' }}>{multiplier}</span>
          <button onClick={() => setMultiplier(m => m + 1)}>+</button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Component Render Count:</strong> {renderCount}</p>
        
        <Memo
          deps={[count, multiplier]}
          compute={computeResult}
        >
          {(result) => (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
              <p><strong>Memoized Result:</strong> {count} × {multiplier} = {result}</p>
              <p><small>This computation only runs when count or multiplier changes</small></p>
            </div>
          )}
        </Memo>
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>How it works:</strong> The Memo component uses React's useMemo hook to cache the result of the computation. The computation only runs when the dependencies (count or multiplier) change.</p>
      </div>
    </div>
  );
};

// Example component that uses Memo for a more complex computation
const ComplexMemoExample = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState('all');
  const [computeCount, setComputeCount] = useState(0);
  
  // Add a number to the array
  const addNumber = () => {
    const newNumber = Math.floor(Math.random() * 10) + 1;
    setNumbers([...numbers, newNumber]);
  };
  
  // Remove the last number from the array
  const removeNumber = () => {
    if (numbers.length > 0) {
      setNumbers(numbers.slice(0, -1));
    }
  };
  
  // Complex computation that filters and processes the numbers
  const processNumbers = () => {
    console.log('Processing numbers...');
    setComputeCount(prev => prev + 1);
    
    // Simulate expensive computation
    const startTime = performance.now();
    while (performance.now() - startTime < 20) {
      // Artificial delay to simulate work
    }
    
    let filteredNumbers;
    switch (filter) {
      case 'even':
        filteredNumbers = numbers.filter(n => n % 2 === 0);
        break;
      case 'odd':
        filteredNumbers = numbers.filter(n => n % 2 !== 0);
        break;
      default:
        filteredNumbers = [...numbers];
    }
    
    const sum = filteredNumbers.reduce((acc, n) => acc + n, 0);
    const average = filteredNumbers.length > 0 ? sum / filteredNumbers.length : 0;
    
    return {
      filtered: filteredNumbers,
      sum,
      average: average.toFixed(2)
    };
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Complex Memo Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={addNumber} style={{ marginRight: '10px' }}>Add Random Number</button>
          <button onClick={removeNumber}>Remove Last Number</button>
        </div>
        
        <div>
          <label style={{ marginRight: '10px' }}>Filter:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px' }}
          >
            <option value="all">All Numbers</option>
            <option value="even">Even Numbers</option>
            <option value="odd">Odd Numbers</option>
          </select>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Numbers:</strong> [{numbers.join(', ')}]</p>
        <p><strong>Computation Count:</strong> {computeCount}</p>
        
        <Memo
          deps={[numbers, filter]}
          compute={processNumbers}
        >
          {(result) => (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
              <p><strong>Filtered Numbers:</strong> [{result.filtered.join(', ')}]</p>
              <p><strong>Sum:</strong> {result.sum}</p>
              <p><strong>Average:</strong> {result.average}</p>
            </div>
          )}
        </Memo>
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The computation only runs when the numbers array or filter changes. Try changing the filter multiple times - the computation count will only increase once per filter change.</p>
      </div>
    </div>
  );
};

export const Simple: Story = {
  render: () => <SimpleMemoExample />,
};

export const Complex: Story = {
  render: () => <ComplexMemoExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <SimpleMemoExample />
      <div style={{ height: '20px' }} />
      <ComplexMemoExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Memo component is a helper that wraps React's useMemo hook to make it easier to use in JSX.

\`\`\`tsx
import { Memo } from './components/Memo';

// Simple example
<Memo
  deps={[count, multiplier]}
  compute={() => count * multiplier}
>
  {(result) => <div>Result: {result}</div>}
</Memo>

// Complex example
<Memo
  deps={[data, filter]}
  compute={() => {
    // Expensive computation that depends on data and filter
    const filtered = data.filter(applyFilter);
    const processed = filtered.map(processItem);
    return { filtered, processed, total: processed.length };
  }}
>
  {(result) => (
    <div>
      <p>Filtered Count: {result.filtered.length}</p>
      <p>Total: {result.total}</p>
      <ul>
        {result.processed.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )}
</Memo>
\`\`\`

The Memo component takes three props:
- \`deps\`: An array of dependencies that determine when the computation should be re-run
- \`compute\`: A function that computes a value
- \`children\`: A render function that receives the computed value and returns a React node

The component:
- Uses React's useMemo hook to memoize the result of the computation
- Only re-computes the value when the dependencies change
- Passes the computed value to the children render function

This component is useful for:
- Optimizing performance by avoiding unnecessary re-computations
- Memoizing expensive calculations in render functions
- Making memoization more declarative and easier to read in JSX
- Isolating complex computations from the rendering logic
        `,
      },
    },
  },
};