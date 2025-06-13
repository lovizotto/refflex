import type { Meta, StoryObj } from '@storybook/react-vite';
import { PushNotification } from './PushNotification';
import { useState, useEffect } from 'react';
import { createSignal } from '../core/createSignal';
import { Signal } from './Signal';

// Mock Notification API for Storybook
class MockNotification {
  static permission: NotificationPermission = 'default';
  static requestPermission: () => Promise<NotificationPermission> = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        MockNotification.permission = 'granted';
        resolve('granted');
      }, 1000);
    });
  };
}

// Save original Notification
const OriginalNotification = window.Notification;

// Override Notification for Storybook
(window as any).Notification = MockNotification;

// Mock service worker for Storybook
const mockServiceWorker = {
  addEventListener: (event: string, handler: EventListener) => {
    console.log(`Added ${event} event listener`);
  },
  removeEventListener: (event: string, handler: EventListener) => {
    console.log(`Removed ${event} event listener`);
  },
  ready: Promise.resolve({
    active: {}
  })
};

// Save original serviceWorker
const originalServiceWorker = navigator.serviceWorker;

// Override serviceWorker for Storybook
Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  configurable: true
});

const meta = {
  title: 'Components/PushNotification',
  component: PushNotification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PushNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic PushNotification example
const BasicPushNotificationExample = () => {
  const [status, setStatus] = createSignal<string>('Waiting for permission...');
  const [messages, setMessages] = createSignal<string[]>([]);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  const simulatePushMessage = () => {
    // Create a mock push event
    const pushEvent = new Event('push') as any;

    // Dispatch the event to the service worker
    setTimeout(() => {
      addMessage('Received push notification: "You have a new message!"');
    }, 500);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '400px' }}>
      <h3>Basic Push Notification Example</h3>

      <PushNotification
        askPermission={true}
        onGranted={() => {
          setStatus('Permission granted');
          addMessage('Notification permission granted');
        }}
        onDenied={() => {
          setStatus('Permission denied');
          addMessage('Notification permission denied');
        }}
        onMessage={(event) => {
          addMessage(`Received push notification: ${JSON.stringify(event)}`);
        }}
      />

      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Signal value={status}>
          {(currentStatus) => (
            <div style={{ 
              display: 'inline-block', 
              padding: '5px 10px', 
              backgroundColor: currentStatus === 'Permission granted' ? '#4CAF50' : 
                              currentStatus === 'Permission denied' ? '#F44336' : '#FFC107',
              color: 'white',
              borderRadius: '4px'
            }}>
              {currentStatus}
            </div>
          )}
        </Signal>
      </div>

      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <button 
          onClick={simulatePushMessage}
          style={{ padding: '8px 12px' }}
          disabled={status() !== 'Permission granted'}
        >
          Simulate Push Notification
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4>Events:</h4>
        <Signal value={messages}>
          {(messageList) => (
            <ul style={{ 
              maxHeight: '200px', 
              overflow: 'auto', 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              margin: 0,
              listStyleType: 'none'
            }}>
              {messageList.map((msg, index) => (
                <li key={index} style={{ 
                  padding: '5px',
                  borderBottom: index < messageList.length - 1 ? '1px solid #ddd' : 'none'
                }}>
                  {msg}
                </li>
              ))}
            </ul>
          )}
        </Signal>
      </div>
    </div>
  );
};

// Notification Center example
const NotificationCenterExample = () => {
  const [permissionStatus, setPermissionStatus] = createSignal<NotificationPermission>('default');
  const [notifications, setNotifications] = createSignal<{id: number, title: string, body: string, read: boolean}[]>([
    { id: 1, title: 'Welcome', body: 'Welcome to the notification center!', read: false },
    { id: 2, title: 'New Feature', body: 'Check out our new features', read: true }
  ]);

  const addNotification = (title: string, body: string) => {
    const newId = notifications().length > 0 ? Math.max(...notifications().map(n => n.id)) + 1 : 1;
    setNotifications(prev => [...prev, { id: newId, title, body, read: false }]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const simulateNewNotification = () => {
    addNotification('New Message', 'You have received a new message from the system.');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Notification Center Example</h3>

      <PushNotification
        askPermission={true}
        onGranted={() => {
          setPermissionStatus('granted');
        }}
        onDenied={() => {
          setPermissionStatus('denied');
        }}
        onMessage={(event) => {
          // In a real app, this would parse the push event data
          addNotification('New Push', 'You received a push notification');
        }}
      />

      <div style={{ marginTop: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Signal value={permissionStatus}>
          {(status) => (
            <div style={{ 
              display: 'inline-block', 
              padding: '5px 10px', 
              backgroundColor: status === 'granted' ? '#4CAF50' : 
                              status === 'denied' ? '#F44336' : '#FFC107',
              color: 'white',
              borderRadius: '4px'
            }}>
              Notification Status: {status}
            </div>
          )}
        </Signal>

        <button 
          onClick={simulateNewNotification}
          style={{ padding: '8px 12px' }}
        >
          Simulate New Notification
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4>Notification Center:</h4>
        <Signal value={notifications}>
          {(notificationList) => (
            <div style={{ 
              maxHeight: '300px', 
              overflow: 'auto', 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px'
            }}>
              {notificationList.length === 0 ? (
                <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                  No notifications
                </div>
              ) : (
                notificationList.map((notification) => (
                  <div 
                    key={notification.id} 
                    style={{ 
                      padding: '10px', 
                      margin: '5px 0', 
                      backgroundColor: notification.read ? '#fff' : '#e3f2fd', 
                      borderRadius: '4px',
                      borderLeft: notification.read ? '3px solid #ccc' : '3px solid #2196F3',
                      cursor: 'pointer'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {notification.title}
                      {!notification.read && (
                        <span style={{ 
                          display: 'inline-block', 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: '#2196F3', 
                          marginLeft: '5px' 
                        }}></span>
                      )}
                    </div>
                    <div style={{ color: '#666' }}>{notification.body}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </Signal>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicPushNotificationExample />,
};

export const NotificationCenter: Story = {
  render: () => <NotificationCenterExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BasicPushNotificationExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The PushNotification component provides a simple way to integrate browser push notifications in your React application.

\`\`\`tsx
import { PushNotification } from './components/PushNotification';

// Basic usage example
const NotificationExample = () => {
  return (
    <PushNotification
      askPermission={true}
      onGranted={() => {
        console.log('Notification permission granted');
      }}
      onDenied={() => {
        console.log('Notification permission denied');
      }}
      onMessage={(event) => {
        console.log('Received push notification:', event);
      }}
    />
  );
};
\`\`\`

The PushNotification component handles:

1. Requesting notification permissions from the user
2. Providing callbacks for permission status changes
3. Setting up event listeners for incoming push notifications
4. Cleaning up event listeners when the component unmounts

Props:
- \`askPermission\`: Boolean to control whether to automatically request notification permission (default: true)
- \`onGranted\`: Callback function that is called when notification permission is granted
- \`onDenied\`: Callback function that is called when notification permission is denied
- \`onMessage\`: Callback function that is called when a push notification is received

The component checks if the browser supports notifications and service workers before attempting to use them. It also handles the different states of notification permissions (default, granted, denied).

Note: For push notifications to work in production, you need to:
1. Register a service worker
2. Set up a push notification server
3. Subscribe the user to push notifications using the PushManager API
        `,
      },
    },
  },
};

// Restore the original Notification and serviceWorker after the story is unmounted
export const Cleanup = () => {
  useEffect(() => {
    return () => {
      window.Notification = OriginalNotification;
      Object.defineProperty(navigator, 'serviceWorker', {
        value: originalServiceWorker,
        configurable: true
      });
    };
  }, []);

  return null;
};
