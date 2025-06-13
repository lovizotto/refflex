import type { Meta, StoryObj } from '@storybook/react-vite';
import { WebSocket, OnMessage, OnOpen, OnClose } from './WebSocket';
import { useState, useEffect } from 'react';
import { createSignal } from '../core/createSignal';
import { Signal } from './Signal';

const meta = {
  title: 'Components/WebSocket',
  component: WebSocket,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebSocket>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock WebSocket for Storybook
class MockWebSocket {
  url: string;
  listeners: Record<string, Array<Function>>;
  readyState: number;

  constructor(url: string) {
    this.url = url;
    this.listeners = {
      open: [],
      message: [],
      close: [],
    };
    this.readyState = 0; // CONNECTING

    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.listeners.open.forEach(listener => listener());
    }, 1000);
  }

  addEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  removeEventListener(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
    }
  }

  send(data: string) {
    console.log('Sending data:', data);
    // Simulate echo response
    setTimeout(() => {
      this.listeners.message.forEach(listener => 
        listener({ data: `Echo: ${data}` })
      );
    }, 500);
  }

  close() {
    this.readyState = 3; // CLOSED
    this.listeners.close.forEach(listener => listener());
  }
}

// Override the global WebSocket with our mock for Storybook
(window as any).OriginalWebSocket = window.WebSocket;
window.WebSocket = MockWebSocket as any;

// Basic WebSocket example
const BasicWebSocketExample = () => {
  const [messages, setMessages] = createSignal<string[]>([]);
  const [connected, setConnected] = createSignal(false);
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '400px' }}>
      <h3>Basic WebSocket Example</h3>
      
      <WebSocket url="wss://echo.example.com">
        <OnOpen>
          {() => {
            setConnected(true);
            addMessage('Connected to WebSocket server');
          }}
        </OnOpen>

        <OnMessage>
          {(event) => {
            addMessage(`Received: ${event.data}`);
          }}
        </OnMessage>

        <OnClose>
          {() => {
            setConnected(false);
            addMessage('Disconnected from WebSocket server');
          }}
        </OnClose>

        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Signal value={connected}>
            {(isConnected) => (
              <div style={{ 
                display: 'inline-block', 
                padding: '5px 10px', 
                backgroundColor: isConnected ? '#4CAF50' : '#F44336',
                color: 'white',
                borderRadius: '4px'
              }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            )}
          </Signal>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message"
            style={{ padding: '8px', marginRight: '10px', width: '70%' }}
          />
          <button
            onClick={() => {
              if (inputMessage.trim()) {
                const socket = document.querySelector('[data-testid="websocket"]') as any;
                if (socket && socket.value) {
                  socket.value.send(inputMessage);
                  addMessage(`Sent: ${inputMessage}`);
                  setInputMessage('');
                }
              }
            }}
            style={{ padding: '8px 12px' }}
          >
            Send
          </button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <h4>Messages:</h4>
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
      </WebSocket>
    </div>
  );
};

// Chat application example
const ChatExample = () => {
  const [messages, setMessages] = createSignal<{sender: string, text: string}[]>([]);
  const [connected, setConnected] = createSignal(false);
  const [username, setUsername] = useState('User');
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (sender: string, text: string) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  // Simulate some initial messages
  useEffect(() => {
    setTimeout(() => {
      addMessage('System', 'Welcome to the chat!');
    }, 1500);
    
    setTimeout(() => {
      addMessage('Bot', 'Hello! How can I help you today?');
    }, 2500);
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Chat Application Example</h3>
      
      <WebSocket url="wss://chat.example.com">
        <OnOpen>
          {() => {
            setConnected(true);
            addMessage('System', 'Connected to chat server');
          }}
        </OnOpen>

        <OnMessage>
          {(event) => {
            try {
              const data = JSON.parse(event.data);
              addMessage(data.sender, data.message);
            } catch (e) {
              addMessage('System', `Received: ${event.data}`);
            }
          }}
        </OnMessage>

        <OnClose>
          {() => {
            setConnected(false);
            addMessage('System', 'Disconnected from chat server');
          }}
        </OnClose>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '8px', width: '150px' }}
          />
          <Signal value={connected}>
            {(isConnected) => (
              <div style={{ 
                marginLeft: '10px',
                display: 'inline-block', 
                padding: '5px 10px', 
                backgroundColor: isConnected ? '#4CAF50' : '#F44336',
                color: 'white',
                borderRadius: '4px'
              }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            )}
          </Signal>
        </div>

        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Signal value={messages}>
            {(messageList) => (
              <div style={{ 
                height: '300px', 
                overflow: 'auto', 
                padding: '10px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {messageList.map((msg, index) => (
                  <div key={index} style={{ 
                    padding: '8px 12px',
                    margin: '5px 0',
                    maxWidth: '80%',
                    borderRadius: '8px',
                    alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.sender === 'System' 
                      ? '#e0e0e0' 
                      : (msg.sender === username ? '#DCF8C6' : '#FFFFFF'),
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {msg.sender !== username && (
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '0.8em', 
                        marginBottom: '3px',
                        color: msg.sender === 'System' ? '#666' : '#1976D2'
                      }}>
                        {msg.sender}
                      </div>
                    )}
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>
            )}
          </Signal>
        </div>

        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputMessage.trim() && connected()) {
                const socket = document.querySelector('[data-testid="websocket"]') as any;
                if (socket && socket.value) {
                  const messageData = JSON.stringify({
                    sender: username,
                    message: inputMessage
                  });
                  socket.value.send(messageData);
                  addMessage(username, inputMessage);
                  setInputMessage('');
                }
              }
            }}
            placeholder="Type a message"
            style={{ padding: '8px', flexGrow: 1, marginRight: '10px' }}
          />
          <button
            onClick={() => {
              if (inputMessage.trim() && connected()) {
                const socket = document.querySelector('[data-testid="websocket"]') as any;
                if (socket && socket.value) {
                  const messageData = JSON.stringify({
                    sender: username,
                    message: inputMessage
                  });
                  socket.value.send(messageData);
                  addMessage(username, inputMessage);
                  setInputMessage('');
                }
              }
            }}
            style={{ padding: '8px 12px' }}
          >
            Send
          </button>
        </div>
      </WebSocket>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicWebSocketExample />,
};

export const ChatApplication: Story = {
  render: () => <ChatExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BasicWebSocketExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The WebSocket component provides a simple way to integrate WebSocket connections in your React application.

\`\`\`tsx
import { WebSocket, OnMessage, OnOpen, OnClose } from './components/WebSocket';

// Basic usage example
const WebSocketExample = () => {
  return (
    <WebSocket url="wss://echo.example.com">
      <OnOpen>
        {() => {
          console.log('Connected to WebSocket server');
        }}
      </OnOpen>

      <OnMessage>
        {(event) => {
          console.log('Received message:', event.data);
        }}
      </OnMessage>

      <OnClose>
        {() => {
          console.log('Disconnected from WebSocket server');
        }}
      </OnClose>

      {/* Your application components */}
      <div>
        <button onClick={() => {
          // Access the WebSocket instance
          const socket = document.querySelector('[data-testid="websocket"]').value;
          socket.send('Hello, WebSocket!');
        }}>
          Send Message
        </button>
      </div>
    </WebSocket>
  );
};
\`\`\`

The WebSocket component consists of four main parts:

1. **WebSocket**: The main component that establishes a WebSocket connection.
   - \`url\`: The WebSocket server URL to connect to.
   - \`children\`: The components that will have access to the WebSocket context.

2. **OnMessage**: A component to handle incoming messages from the WebSocket.
   - \`children\`: A function that receives the MessageEvent.

3. **OnOpen**: A component to handle the WebSocket connection opening.
   - \`children\`: A function that is called when the connection is established.

4. **OnClose**: A component to handle the WebSocket connection closing.
   - \`children\`: A function that is called when the connection is closed.

The WebSocket component creates a context that provides the WebSocket instance to its children components. The event handler components (OnMessage, OnOpen, OnClose) use this context to register event listeners on the WebSocket instance.
        `,
      },
    },
  },
};

// Restore the original WebSocket after the story is unmounted
export const Cleanup = () => {
  useEffect(() => {
    return () => {
      window.WebSocket = (window as any).OriginalWebSocket;
    };
  }, []);
  
  return null;
};