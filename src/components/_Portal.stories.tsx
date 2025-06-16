import type { Meta, StoryObj } from '@storybook/react-vite';
import { Portal } from './Portal';
import { useState } from 'react';

const meta = {
  title: 'Components/Portal',
  component: Portal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Portal for a modal
const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Modal Portal Example</h3>
      <p>Click the button to open a modal that renders outside the normal DOM hierarchy.</p>
      
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '8px 16px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Open Modal
      </button>
      
      {isOpen && (
        <Portal>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h2>Modal Title</h2>
              <p>This modal is rendered using a Portal component, which means it's not in the normal DOM hierarchy.</p>
              <p>Instead, it's appended to the document body, which helps with z-index and styling issues.</p>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px' }}
              >
                Close Modal
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

// Example component that uses Portal for a tooltip
const TooltipExample = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const items = [
    { id: '1', text: 'Hover me 1', tooltip: 'This is tooltip content for item 1' },
    { id: '2', text: 'Hover me 2', tooltip: 'This is tooltip content for item 2' },
    { id: '3', text: 'Hover me 3', tooltip: 'This is tooltip content for item 3' }
  ];
  
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  const handleMouseEnter = (id: string, e: React.MouseEvent) => {
    setActiveTooltip(id);
    setTooltipPosition({
      top: e.clientY + 10,
      left: e.clientX + 10
    });
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Tooltip Portal Example</h3>
      <p>Hover over the items below to see tooltips rendered with Portal:</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {items.map(item => (
          <div 
            key={item.id}
            style={{ 
              padding: '10px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => handleMouseEnter(item.id, e)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {item.text}
          </div>
        ))}
      </div>
      
      {activeTooltip && (
        <Portal>
          <div style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            backgroundColor: 'black',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            {items.find(item => item.id === activeTooltip)?.tooltip}
          </div>
        </Portal>
      )}
    </div>
  );
};

// Example component that uses Portal for a notification
const NotificationExample = () => {
  const [notifications, setNotifications] = useState<Array<{ id: string, message: string }>>([]);
  
  const addNotification = () => {
    const id = Date.now().toString();
    const message = `Notification ${id} - ${new Date().toLocaleTimeString()}`;
    
    setNotifications(prev => [...prev, { id, message }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Notification Portal Example</h3>
      <p>Click the button to add notifications that render outside the normal DOM hierarchy.</p>
      
      <button 
        onClick={addNotification}
        style={{ padding: '8px 16px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Add Notification
      </button>
      
      <Portal>
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 1000
        }}>
          {notifications.map(notification => (
            <div 
              key={notification.id}
              style={{
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                padding: '10px 15px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                animation: 'fadeIn 0.3s ease-in-out',
                minWidth: '200px'
              }}
            >
              {notification.message}
            </div>
          ))}
        </div>
      </Portal>
    </div>
  );
};

export const Modal: Story = {
  render: () => <ModalExample />,
};

export const Tooltip: Story = {
  render: () => <TooltipExample />,
};

export const Notification: Story = {
  render: () => <NotificationExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <ModalExample />
      <div style={{ height: '20px' }} />
      <TooltipExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Portal component is a helper that renders its children outside the normal DOM hierarchy, typically at the end of the document body.

\`\`\`tsx
import { Portal } from './components/Portal';
import { useState } from 'react';

// Create state to control visibility
const [isOpen, setIsOpen] = useState(false);

// Use Portal to render a modal
{isOpen && (
  <Portal>
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modal Title</h2>
        <p>This content is rendered at the end of the document body.</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
  </Portal>
)}
\`\`\`

The Portal component takes one prop:
- \`children\`: The content to be rendered in the portal

The component:
- Creates a new div element when mounted
- Appends the div to the document body
- Renders the children into this div using React's createPortal
- Removes the div from the document body when unmounted

Common use cases:
- Modals and dialogs
- Tooltips and popovers
- Notifications and toasts
- Dropdown menus
- Any UI that needs to "break out" of its parent's overflow or z-index constraints
        `,
      },
    },
  },
};