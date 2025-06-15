import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReadableStream } from './ReadableStream';
import { useState, useEffect } from 'react';
import { createSignal } from '../core/createSignal';

const meta = {
  title: 'Components/ReadableStream',
  component: ReadableStream,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReadableStream>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock ReadableStream for Storybook
class MockReadableStream {
  private controller: ReadableStreamController<Uint8Array> | null = null;
  private stream: globalThis.ReadableStream<Uint8Array>;

  constructor() {
    this.stream = new globalThis.ReadableStream({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  // Method to push data to the stream
  pushData(data: string) {
    if (this.controller) {
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(data);
      this.controller.enqueue(uint8Array);
    }
  }

  // Method to close the stream
  close() {
    if (this.controller) {
      this.controller.close();
    }
  }

  // Method to signal an error
  error(err: any) {
    if (this.controller) {
      this.controller.error(err);
    }
  }

  // Get the actual ReadableStream
  getStream() {
    return this.stream;
  }
}

// Basic ReadableStream example
const BasicReadableStreamExample = () => {
  const [mockStream] = useState(() => new MockReadableStream());
  const [messages, setMessages] = createSignal<string[]>([]);
  const [isStreamClosed, setIsStreamClosed] = createSignal(false);
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '400px' }}>
      <h3>Basic ReadableStream Example</h3>
      
      <ReadableStream 
        src={mockStream.getStream()}
        onChunk={(chunk) => {
          const decoder = new TextDecoder();
          const text = decoder.decode(chunk);
          addMessage(`Received: ${text}`);
        }}
        onDone={() => {
          addMessage('Stream closed');
          setIsStreamClosed(true);
        }}
        onError={(err) => {
          addMessage(`Error: ${err.message || 'Unknown error'}`);
        }}
      >
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '5px 10px', 
            backgroundColor: isStreamClosed() ? '#F44336' : '#4CAF50',
            color: 'white',
            borderRadius: '4px'
          }}>
            Stream {isStreamClosed() ? 'Closed' : 'Open'}
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message to send"
            style={{ padding: '8px', marginRight: '10px', width: '70%' }}
          />
          <button
            onClick={() => {
              if (inputMessage.trim()) {
                mockStream.pushData(inputMessage);
                addMessage(`Sent: ${inputMessage}`);
                setInputMessage('');
              }
            }}
            style={{ padding: '8px 12px' }}
            disabled={isStreamClosed()}
          >
            Send
          </button>
        </div>

        <div>
          <button
            onClick={() => mockStream.close()}
            style={{ padding: '8px 12px', marginRight: '10px' }}
            disabled={isStreamClosed()}
          >
            Close Stream
          </button>
          <button
            onClick={() => mockStream.error(new Error('Simulated error'))}
            style={{ padding: '8px 12px' }}
            disabled={isStreamClosed()}
          >
            Trigger Error
          </button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <h4>Messages:</h4>
          <div style={{ 
            maxHeight: '200px', 
            overflow: 'auto', 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px'
          }}>
            <ul style={{ 
              margin: 0,
              padding: 0,
              listStyleType: 'none'
            }}>
              {messages().map((msg, index) => (
                <li key={index} style={{ 
                  padding: '5px',
                  borderBottom: index < messages().length - 1 ? '1px solid #ddd' : 'none'
                }}>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ReadableStream>
    </div>
  );
};

// BindText file streaming example
const TextFileStreamingExample = () => {
  const [mockStream] = useState(() => new MockReadableStream());
  const [content, setContent] = createSignal<string>('');
  const [isStreaming, setIsStreaming] = createSignal(false);
  const [progress, setProgress] = createSignal(0);
  const [error, setError] = createSignal<string | null>(null);

  // Simulate streaming a text file
  const simulateFileStreaming = () => {
    setIsStreaming(true);
    setContent('');
    setError(null);
    setProgress(0);
    
    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, 
eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.`;
    
    const chunks = text.split(' ');
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < chunks.length) {
        mockStream.pushData(chunks[index] + ' ');
        index++;
        setProgress(Math.floor((index / chunks.length) * 100));
      } else {
        clearInterval(interval);
        mockStream.close();
      }
    }, 100);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Text File Streaming Example</h3>
      
      <ReadableStream 
        src={mockStream.getStream()}
        onChunk={(chunk) => {
          const decoder = new TextDecoder();
          const text = decoder.decode(chunk);
          setContent(prev => prev + text);
        }}
        onDone={() => {
          setIsStreaming(false);
        }}
        onError={(err) => {
          setError(err.message || 'Unknown error');
          setIsStreaming(false);
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          <button
            onClick={simulateFileStreaming}
            style={{ padding: '8px 12px', marginRight: '10px' }}
            disabled={isStreaming()}
          >
            Start Streaming
          </button>
          <button
            onClick={() => {
              mockStream.error(new Error('Failed to read file'));
            }}
            style={{ padding: '8px 12px' }}
            disabled={!isStreaming()}
          >
            Simulate Error
          </button>
        </div>

        {isStreaming() && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '4px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${progress()}%`, 
                height: '10px', 
                backgroundColor: '#4CAF50', 
                transition: 'width 0.3s ease' 
              }}></div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
              {progress()}% complete
            </div>
          </div>
        )}

        {error() && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            borderRadius: '4px', 
            marginBottom: '15px' 
          }}>
            Error: {error()}
          </div>
        )}

        <div style={{ marginTop: '10px' }}>
          <h4>File Content:</h4>
          <div style={{ 
            height: '200px', 
            overflow: 'auto', 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {content() || 'No content yet. Click "Start Streaming" to begin.'}
          </div>
        </div>
      </ReadableStream>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicReadableStreamExample />,
};

export const TextFileStreaming: Story = {
  render: () => <TextFileStreamingExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BasicReadableStreamExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The ReadableStream component provides a simple way to work with the Web Streams API in React applications.

\`\`\`tsx
import { ReadableStream } from './components/ReadableStream';

// Basic usage example
const StreamExample = () => {
  // Get a ReadableStream from somewhere (fetch, file API, etc.)
  const stream = getReadableStream();
  
  return (
    <ReadableStream 
      src={stream}
      onChunk={(chunk) => {
        // Process each chunk of data
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk);
        console.log('Received chunk:', text);
      }}
      onDone={() => {
        console.log('Stream completed');
      }}
      onError={(err) => {
        console.error('Stream error:', err);
      }}
    >
      <div>Your UI components here</div>
    </ReadableStream>
  );
};
\`\`\`

The ReadableStream component handles the lifecycle of a ReadableStream:

1. It automatically reads from the stream when mounted
2. It processes each chunk of data through the onChunk callback
3. It handles stream completion with the onDone callback
4. It handles errors with the onError callback
5. It cleans up resources when unmounted

This component is useful for:
- Streaming API responses
- Processing large files
- Real-time data processing
- Server-sent events

The component accepts the following props:

- \`src\`: The ReadableStream to read from
- \`onChunk\`: Callback function that receives each chunk of data (Uint8Array)
- \`onDone\`: Callback function called when the stream is complete
- \`onError\`: Callback function called when an error occurs
- \`children\`: React components to render
        `,
      },
    },
  },
};