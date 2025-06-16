import type { Meta, StoryObj } from '@storybook/react-vite';
import { TransitionZone } from './TransitionZone';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/TransitionZone',
  component: TransitionZone,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TransitionZone>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create a computationally expensive component
const ExpensiveComponent = ({ itemCount = 2000 }: { itemCount?: number }) => {
  // Force layout calculations by creating many items
  const items = Array.from({ length: itemCount }, (_, i) => {
    // Do some "expensive" calculations for each item
    let result = 0;
    for (let j = 0; j < 1000; j++) {
      result += Math.sin(j * i);
    }
    return { id: i, value: result };
  });

  return (
    <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #eee', padding: '10px' }}>
      <h4>Expensive Component ({itemCount.toLocaleString()} items)</h4>
      {items.map(item => (
        <div key={item.id} style={{ padding: '4px', borderBottom: '1px solid #f0f0f0' }}>
          Item #{item.id} - Value: {item.value.toFixed(2)}
        </div>
      ))}
    </div>
  );
};

// Basic example showing the difference with and without TransitionZone
const BasicExample = () => {
  const [showWithTransition, setShowWithTransition] = useState(false);
  const [showWithoutTransition, setShowWithoutTransition] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  
  // Update render count to show UI is still responsive
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount(prev => prev + 1);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '800px' }}>
      <h3>TransitionZone Example</h3>
      <p>This example demonstrates how TransitionZone can improve UI responsiveness when rendering expensive components.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <p>UI Responsiveness Counter: {renderCount}</p>
        <p>Try typing in this input field while the expensive components are rendering:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          placeholder="Type here to test UI responsiveness"
        />
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setShowWithTransition(!showWithTransition)}
          style={{ padding: '8px 16px' }}
        >
          {showWithTransition ? 'Hide' : 'Show'} With TransitionZone
        </button>
        
        <button
          onClick={() => setShowWithoutTransition(!showWithoutTransition)}
          style={{ padding: '8px 16px' }}
        >
          {showWithoutTransition ? 'Hide' : 'Show'} Without TransitionZone
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>With TransitionZone</h3>
          {showWithTransition && (
            <TransitionZone>
              <ExpensiveComponent />
            </TransitionZone>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Without TransitionZone</h3>
          {showWithoutTransition && <ExpensiveComponent />}
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> When you click "Show Without TransitionZone", you might notice the UI freezes briefly while the component renders. With TransitionZone, the UI should remain responsive.</p>
      </div>
    </div>
  );
};

// Example with different content types
const ContentSwitchingExample = () => {
  const [contentType, setContentType] = useState<'text' | 'list' | 'grid' | 'table'>('text');
  const [inputValue, setInputValue] = useState('');
  
  const renderContent = () => {
    switch (contentType) {
      case 'text':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <h3>Text Content</h3>
            <p>This is a simple text content that doesn't require much rendering work.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.</p>
          </div>
        );
      
      case 'list':
        return <ExpensiveComponent itemCount={1000} />;
      
      case 'grid':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <h3>Grid Content</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {Array.from({ length: 500 }, (_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '20px', 
                    backgroundColor: `hsl(${i % 360}, 70%, 80%)`,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' }}>
            <h3>Table Content</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Value</th>
                  <th style={{ padding: '8px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 1000 }, (_, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{i + 1}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Item {i + 1}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{(Math.sin(i) * 100).toFixed(2)}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '800px' }}>
      <h3>Content Switching Example</h3>
      <p>This example demonstrates how TransitionZone can help when switching between different types of content.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Try typing in this input field while switching between content types:</p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          placeholder="Type here to test UI responsiveness"
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setContentType('text')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: contentType === 'text' ? '#1890ff' : '#f0f0f0',
            color: contentType === 'text' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Text
        </button>
        
        <button
          onClick={() => setContentType('list')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: contentType === 'list' ? '#1890ff' : '#f0f0f0',
            color: contentType === 'list' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          List
        </button>
        
        <button
          onClick={() => setContentType('grid')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: contentType === 'grid' ? '#1890ff' : '#f0f0f0',
            color: contentType === 'grid' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Grid
        </button>
        
        <button
          onClick={() => setContentType('table')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: contentType === 'table' ? '#1890ff' : '#f0f0f0',
            color: contentType === 'table' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Table
        </button>
      </div>
      
      <TransitionZone>
        {renderContent()}
      </TransitionZone>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> TransitionZone helps keep the UI responsive when switching between different content types, especially when the content is complex or requires significant rendering work.</p>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const ContentSwitching: Story = {
  render: () => <ContentSwitchingExample />,
};

export const WithDescription: Story = {
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story: `
The TransitionZone component is a helper that uses React's \`startTransition\` API to render its children in a non-blocking way, improving UI responsiveness.

\`\`\`tsx
import { TransitionZone } from './components/TransitionZone';

// Use TransitionZone to render expensive components without blocking the UI
<TransitionZone>
  <ExpensiveComponent />
</TransitionZone>
\`\`\`

The TransitionZone component takes one prop:
- \`children\`: The content to be rendered in a non-blocking way

The component:
- Uses React's \`startTransition\` API to mark the rendering of its children as a non-urgent update
- Allows the browser to prioritize more urgent updates (like input handling) over rendering the children
- Helps prevent UI freezes when rendering expensive components

When to use TransitionZone:
- When rendering large lists or tables
- When rendering complex visualizations or charts
- When switching between different views or content types
- Any time you notice the UI becoming unresponsive during rendering

How it works:
1. The component maintains its own state for the content
2. When the children prop changes, it updates the content state inside a \`startTransition\` call
3. React treats this update as non-urgent, allowing other updates (like input handling) to take priority
4. This results in a more responsive UI, even when rendering expensive components
        `,
      },
    },
  },
};