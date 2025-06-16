import type { Meta, StoryObj } from '@storybook/react-vite';
import { History, PushState } from './History';
import { useState } from 'react';

const meta = {
  title: 'Components/History',
  component: History,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof History>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses History to track pathname changes
const HistoryExample = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>History Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Path:</strong> {currentPath}</p>
        <p><em>Note: The History component listens for browser history changes (back/forward buttons).</em></p>
      </div>
      
      <History onChange={(path) => setCurrentPath(path)} />
    </div>
  );
};

// Example component that uses PushState to change the URL
const PushStateExample = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [pushPath, setPushPath] = useState('');
  const [pushKey, setPushKey] = useState(0);
  
  const handlePushState = () => {
    if (pushPath) {
      setPushKey(prev => prev + 1);
      setCurrentPath(pushPath);
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>PushState Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Path:</strong> {currentPath}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={pushPath} 
          onChange={(e) => setPushPath(e.target.value)}
          placeholder="/example-path"
          style={{ marginRight: '10px', padding: '8px', borderRadius: '4px' }}
        />
        <button onClick={handlePushState}>Push State</button>
      </div>
      
      {pushPath && pushKey > 0 && (
        <PushState key={pushKey} to={pushPath} />
      )}
      
      <History onChange={(path) => setCurrentPath(path)} />
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
        <p><strong>Note:</strong> This example changes the URL without reloading the page. The URL in your browser's address bar will change, but Storybook will remain on the same story.</p>
      </div>
    </div>
  );
};

// Example component that combines History and PushState for a simple router
const SimpleRouterExample = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [pushKey, setPushKey] = useState(0);
  
  const routes = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/products', label: 'Products' },
  ];
  
  const navigateTo = (path: string) => {
    setPushKey(prev => prev + 1);
    setCurrentPath(path);
  };
  
  const renderContent = () => {
    switch (currentPath) {
      case '/home':
        return (
          <div style={{ padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            <h4>Home Page</h4>
            <p>Welcome to the home page!</p>
          </div>
        );
      case '/about':
        return (
          <div style={{ padding: '20px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
            <h4>About Page</h4>
            <p>This is the about page. Learn more about us here.</p>
          </div>
        );
      case '/contact':
        return (
          <div style={{ padding: '20px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
            <h4>Contact Page</h4>
            <p>Contact us at example@example.com</p>
          </div>
        );
      case '/products':
        return (
          <div style={{ padding: '20px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
            <h4>Products Page</h4>
            <p>Browse our products here.</p>
          </div>
        );
      default:
        return (
          <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <h4>404 - Page Not Found</h4>
            <p>The page {currentPath} does not exist.</p>
          </div>
        );
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Simple Router Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Path:</strong> {currentPath}</p>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px'
      }}>
        {routes.map((route) => (
          <button 
            key={route.path} 
            onClick={() => navigateTo(route.path)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: currentPath === route.path ? '#1890ff' : '#f5f5f5',
              color: currentPath === route.path ? 'white' : 'black',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {route.label}
          </button>
        ))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        {renderContent()}
      </div>
      
      {pushKey > 0 && (
        <PushState key={pushKey} to={currentPath} />
      )}
      
      <History onChange={(path) => setCurrentPath(path)} />
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
        <p><strong>Note:</strong> You can use the browser's back and forward buttons to navigate between routes.</p>
      </div>
    </div>
  );
};

export const HistoryTracker: Story = {
  render: () => <HistoryExample />,
};

export const UrlChanger: Story = {
  render: () => <PushStateExample />,
};

export const SimpleRouter: Story = {
  render: () => <SimpleRouterExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <HistoryExample />
      <div style={{ height: '20px' }} />
      <PushStateExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The History module provides two components for working with browser history:

1. \`History\`: Listens for changes to the browser's history and calls a callback
2. \`PushState\`: Pushes a new state to the browser's history

\`\`\`tsx
import { History, PushState } from './components/History';
import { useState } from 'react';

// Track pathname changes
const [currentPath, setCurrentPath] = useState(window.location.pathname);

// Use History to listen for changes
<History onChange={(path) => setCurrentPath(path)} />

// Use PushState to change the URL without page reload
<PushState to="/new-path" />

// Combined for a simple router
const navigateTo = (path) => {
  setCurrentPath(path);
  // Use a key to force re-mounting of PushState
  setPushKey(prev => prev + 1);
};

<button onClick={() => navigateTo('/about')}>About</button>
<PushState key={pushKey} to={currentPath} />
<History onChange={(path) => setCurrentPath(path)} />
\`\`\`

The History component takes one prop:
- \`onChange\`: A callback function that receives the current pathname

The PushState component takes one prop:
- \`to\`: The path to push to the browser's history

These components are useful for:
- Building simple routing systems without a full router library
- Tracking URL changes in single-page applications
- Updating the browser's address bar without page reloads
- Creating bookmarkable states in your application
        `,
      },
    },
  },
};