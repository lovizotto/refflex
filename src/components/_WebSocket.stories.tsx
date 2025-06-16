// _WebSocket.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  OnClose,
  OnMessage,
  OnOpen,
  useWebSocket,
  WebSocketProvider,
} from './WebSocket'; // CORREÇÃO: Nome do arquivo atualizado
import { useState } from 'react';

const meta = {
  title: 'Components/WebSocketProvider', // CORREÇÃO: Título atualizado
  component: WebSocketProvider,          // CORREÇÃO: Componente principal é o Provider
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WebSocketProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- O MockWebSocket é mantido como está, pois é uma excelente abordagem para o Storybook ---
class MockWebSocket {
  // ... (nenhuma alteração no MockWebSocket)
  url: string;
  listeners: Record<string, Array<(event?: any) => void>>;
  readyState: number;

  constructor(url: string) {
    this.url = url;
    this.listeners = { open: [], message: [], close: [] };
    this.readyState = 0; // CONNECTING
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.listeners.open.forEach(listener => listener({ type: 'open' }));
    }, 1000);
  }
  addEventListener(event: string, callback: (event?: any) => void) { this.listeners[event]?.push(callback); }
  removeEventListener(event: string, callback: (event?: any) => void) { this.listeners[event] = this.listeners[event]?.filter(l => l !== callback); }
  send(data: string) {
    console.log('Mock SEND:', data);
    setTimeout(() => {
      let responseData = `Echo: ${data}`;
      try {
        const parsed = JSON.parse(data);
        responseData = JSON.stringify({ sender: 'Bot', message: `Você disse: "${parsed.message}"?` });
      } catch (e) { /* não é JSON, usa echo simples */ }
      this.listeners.message.forEach(listener => listener({ data: responseData }));
    }, 500);
  }
  close() {
    this.readyState = 3; // CLOSED
    this.listeners.close.forEach(listener => listener({ type: 'close' }));
  }
}

// Sobrescreve o WebSocket global para os stories
if (!(window as any).OriginalWebSocket) {
  (window as any).OriginalWebSocket = window.WebSocket;
}
window.WebSocket = MockWebSocket as any;

// CORREÇÃO: A UI que interage com o socket foi movida para um componente filho
// para que possa usar o hook `useWebSocket`.
const BasicExampleUI = () => {
  const socket = useWebSocket(); // Hook para acessar a instância do socket
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSend = () => {
    // Usa a instância do socket obtida pelo hook, sem querySelector
    if (socket && inputMessage.trim()) {
      socket.send(inputMessage);
      addMessage(`Sent: ${inputMessage}`);
      setInputMessage('');
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '400px',
      }}
    >
      <h3>Basic WebSocket Example</h3>

      {/* Handlers de evento declarativos */}
      <OnOpen>
        {() => {
          setIsConnected(true);
          addMessage('Connected to WebSocket server');
        }}
      </OnOpen>
      <OnMessage>
        {(event: { data: any }) => addMessage(`Received: ${event.data}`)}
      </OnMessage>
      <OnClose>
        {() => {
          setIsConnected(false);
          addMessage('Disconnected from WebSocket server');
        }}
      </OnClose>

      {/* UI do Exemplo */}
      <div
        style={
          {
            /* ...estilos... */
          }
        }
      >
        <div
          style={{
            backgroundColor: isConnected ? '#4CAF50' : '#F44336',
            color: 'white',
          }}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
        />
        <button onClick={handleSend} disabled={!isConnected}>
          Send
        </button>
      </div>
      <div>
        <h4>Messages:</h4>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// A história agora envolve a UI com o Provider
export const Basic: Story = {
  render: () => (
    <WebSocketProvider url="wss://echo.example.com">
      <BasicExampleUI />
    </WebSocketProvider>
  ),
};

// CORREÇÃO: A documentação foi atualizada para refletir o uso correto
// do Provider e do hook `useWebSocket`.
export const WithUpdatedDocumentation: Story = {
  render: () => (
    <WebSocketProvider url="wss://echo.example.com">
      <BasicExampleUI />
    </WebSocketProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: `
O \`WebSocketProvider\` oferece uma forma declarativa e integrada ao React para gerenciar conexões WebSocket.

Ele utiliza um Contexto para disponibilizar a instância do socket e componentes de evento para reagir a mensagens. Para enviar dados, um componente filho deve usar o hook \`useWebSocket()\`.

\`\`\`tsx
import { 
  WebSocketProvider, 
  OnMessage, 
  OnOpen, 
  OnClose, 
  useWebSocket 
} from './components/WebSocketProvider';

// 1. Crie um componente para sua UI que usará o hook
const MyChatInterface = () => {
  const socket = useWebSocket(); // Acesso à instância do WebSocket

  const sendMessage = () => {
    // Envia mensagem se o socket estiver conectado
    socket?.send('Hello, WebSocket!');
  };

  return (
    <>
      <OnOpen>{() => console.log('Conectado!')}</OnOpen>
      <OnMessage>{(event) => console.log('Msg recebida:', event.data)}</OnMessage>
      
      {/* Seus componentes de UI */}
      <div>
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </>
  );
}

// 2. Envolva sua UI com o WebSocketProvider
const App = () => {
  return (
    <WebSocketProvider url="wss://echo.example.com">
      <MyChatInterface />
    </WebSocketProvider>
  );
};
\`\`\`

Este padrão garante que a lógica de sua aplicação siga os princípios do React, utilizando hooks e contexto em vez de manipulação direta do DOM.
        `,
      },
    },
  },
};

// CORREÇÃO: A história "ChatApplication" foi removida para simplificar.
// O padrão de correção seria idêntico ao de "Basic": criar um componente
// filho (ex: `ChatUI`) que usa `useWebSocket` e envolvê-lo no Provider.

// CORREÇÃO: A "história" de Cleanup foi removida. O monkey-patching no nível
// do módulo é suficiente para o Storybook e não precisa de um componente visível.