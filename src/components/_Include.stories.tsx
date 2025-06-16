import type { Meta, StoryObj } from '@storybook/react-vite';
import { Include } from './Include';
import { useState } from 'react';

const meta = {
  title: 'Components/Include',
  component: Include,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Include>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Include with the 'of' prop
const DirectIncludeExample = () => {
  const [content, setContent] = useState('default');
  
  const renderContent = () => {
    switch (content) {
      case 'default':
        return (
          <div style={{ padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            <h4>Default Content</h4>
            <p>This is the default content.</p>
          </div>
        );
      case 'alternate':
        return (
          <div style={{ padding: '20px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
            <h4>Alternate Content</h4>
            <p>This is the alternate content.</p>
          </div>
        );
      case 'special':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
            <h4>Special Content</h4>
            <p>This is the special content with extra features.</p>
            <button onClick={() => alert('Special action!')}>Special Action</button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Direct Include Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setContent('default')}
          style={{ 
            marginRight: '10px', 
            fontWeight: content === 'default' ? 'bold' : 'normal',
            backgroundColor: content === 'default' ? '#e6f7ff' : '#f5f5f5',
          }}
        >
          Default
        </button>
        <button 
          onClick={() => setContent('alternate')}
          style={{ 
            marginRight: '10px', 
            fontWeight: content === 'alternate' ? 'bold' : 'normal',
            backgroundColor: content === 'alternate' ? '#fff1f0' : '#f5f5f5',
          }}
        >
          Alternate
        </button>
        <button 
          onClick={() => setContent('special')}
          style={{ 
            fontWeight: content === 'special' ? 'bold' : 'normal',
            backgroundColor: content === 'special' ? '#f6ffed' : '#f5f5f5',
          }}
        >
          Special
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <Include of={() => renderContent()} />
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The Include component with the 'of' prop renders the content directly.</p>
      </div>
    </div>
  );
};

// Mock lazy-loaded components for the src prop example
const LazyLoadedExample = () => {
  // In a real application, these would be imported using dynamic import
  // For this story, we'll simulate lazy loading with a timeout
  
  const [selectedComponent, setSelectedComponent] = useState('none');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulated lazy components
  const LazyComponent1 = () => (
    <div style={{ padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
      <h4>Lazy Component 1</h4>
      <p>This component was loaded lazily.</p>
    </div>
  );
  
  const LazyComponent2 = () => (
    <div style={{ padding: '20px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
      <h4>Lazy Component 2</h4>
      <p>This is another lazily loaded component.</p>
    </div>
  );
  
  // Simulate lazy loading with a Promise
  const loadComponent = (name: string) => {
    setIsLoading(true);
    setSelectedComponent(name);
    
    // In a real application, this would be a dynamic import
    return new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      setTimeout(() => {
        if (name === 'component1') {
          resolve({ default: LazyComponent1 });
        } else {
          resolve({ default: LazyComponent2 });
        }
        setIsLoading(false);
      }, 1500); // Simulate network delay
    });
  };
  
  const LoadingFallback = () => (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', textAlign: 'center' }}>
      <p>Loading component...</p>
      <div style={{ 
        width: '50%', 
        height: '4px', 
        backgroundColor: '#ddd', 
        borderRadius: '2px',
        margin: '10px auto',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ 
          width: '30%', 
          height: '100%', 
          backgroundColor: '#1890ff',
          borderRadius: '2px',
          position: 'absolute',
          animation: 'loading 1.5s infinite ease-in-out',
        }}></div>
      </div>
    </div>
  );
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Lazy Loading Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setSelectedComponent('none')}
          style={{ 
            marginRight: '10px', 
            fontWeight: selectedComponent === 'none' ? 'bold' : 'normal',
          }}
        >
          None
        </button>
        <button 
          onClick={() => loadComponent('component1')}
          style={{ 
            marginRight: '10px', 
            fontWeight: selectedComponent === 'component1' ? 'bold' : 'normal',
          }}
          disabled={isLoading}
        >
          Load Component 1
        </button>
        <button 
          onClick={() => loadComponent('component2')}
          style={{ 
            fontWeight: selectedComponent === 'component2' ? 'bold' : 'normal',
          }}
          disabled={isLoading}
        >
          Load Component 2
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', minHeight: '100px' }}>
        {selectedComponent === 'none' ? (
          <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', textAlign: 'center' }}>
            <p>Select a component to load</p>
          </div>
        ) : (
          <Include 
            src={() => loadComponent(selectedComponent)}
            fallback={<LoadingFallback />}
          />
        )}
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The Include component with the 'src' prop loads components lazily using React.lazy and Suspense.</p>
        <p>In a real application, you would use dynamic imports like:</p>
        <pre style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
          {`<Include 
  src={() => import('./SomeComponent')}
  fallback={<LoadingIndicator />}
/>`}
        </pre>
      </div>
      
      <style>
        {`
          @keyframes loading {
            0% {
              left: -30%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export const DirectInclude: Story = {
  render: () => <DirectIncludeExample />,
};

export const LazyLoading: Story = {
  render: () => <LazyLoadedExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <DirectIncludeExample />
      <div style={{ height: '20px' }} />
      <LazyLoadedExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Include component is a helper that provides two ways to include content:

1. Direct inclusion with the \`of\` prop
2. Lazy loading with the \`src\` prop

\`\`\`tsx
import { Include } from './components/Include';

// Direct inclusion
<Include of={() => <SomeComponent />} />

// Lazy loading
<Include 
  src={() => import('./LazyComponent')}
  fallback={<LoadingIndicator />}
/>
\`\`\`

The Include component takes these props:
- \`of\`: A function that returns a React node, which is rendered directly
- \`src\`: A function that returns a Promise that resolves to a component, which is loaded lazily
- \`fallback\`: A React node to show while the lazy component is loading

The component:
- Renders the content directly if the \`of\` prop is provided
- Uses React.lazy and Suspense to load the component lazily if the \`src\` prop is provided
- Shows the fallback while the lazy component is loading
- Returns null if neither \`of\` nor \`src\` is provided

This component is useful for:
- Code splitting and lazy loading components
- Conditional rendering of components
- Improving initial load performance by deferring non-critical components
- Organizing complex UIs with dynamically loaded sections
        `,
      },
    },
  },
};