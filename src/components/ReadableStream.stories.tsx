// components/Rf/ReadableStream.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useEffect } from 'react';
import { ReadableStream } from './ReadableStream';

// A meta-informação do componente permanece a mesma.
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

// A classe MockReadableStream está ótima e não precisa de alterações.
// É uma excelente forma de simular uma stream de forma controlada.
class MockReadableStream {
  private controller: ReadableStreamController<Uint8Array> | null = null;
  public stream: globalThis.ReadableStream<Uint8Array>;

  constructor() {
    this.stream = new globalThis.ReadableStream({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  pushData(data: string) {
    if (this.controller) {
      const encoder = new TextEncoder();
      this.controller.enqueue(encoder.encode(data));
    }
  }

  close() {
    if (this.controller) {
      this.controller.close();
      this.controller = null; // Libera a referência após fechar
    }
  }

  error(err: any) {
    if (this.controller) {
      this.controller.error(err);
      this.controller = null; // Libera a referência após o erro
    }
  }

  getStream() {
    return this.stream;
  }
}

// --- Componente de Exemplo Básico Corrigido ---
const BasicReadableStreamExample = () => {
  // Correção 1: Usar useState para garantir que a instância do mock seja criada apenas uma vez.
  const [mockStream] = useState(() => new MockReadableStream());

  // Correção 2: Substituir `createSignal` por `React.useState` para gestão de estado padrão do React.
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreamClosed, setIsStreamClosed] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '400px' }}>
      <h3>Exemplo Básico de ReadableStream</h3>

      <ReadableStream
        src={mockStream.getStream()}
        onChunk={(chunk) => {
          const text = new TextDecoder().decode(chunk);
          addMessage(`Recebido: ${text}`);
        }}
        onDone={() => {
          addMessage('Stream fechada');
          setIsStreamClosed(true);
        }}
        onError={(err) => {
          addMessage(`Erro: ${err.message || 'Erro desconhecido'}`);
          setIsStreamClosed(true); // Também fechar em caso de erro
        }}
      >
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 10px',
            // Correção 3: Acessar o estado diretamente (isStreamClosed) em vez de como função (isStreamClosed()).
            backgroundColor: isStreamClosed ? '#F44336' : '#4CAF50',
            color: 'white',
            borderRadius: '4px'
          }}>
            Stream {isStreamClosed ? 'Fechada' : 'Aberta'}
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite uma mensagem para enviar"
            style={{ padding: '8px', marginRight: '10px', width: '70%' }}
            disabled={isStreamClosed}
          />
          <button
            onClick={() => {
              if (inputMessage.trim()) {
                mockStream.pushData(inputMessage);
                addMessage(`Enviado: ${inputMessage}`);
                setInputMessage('');
              }
            }}
            style={{ padding: '8px 12px' }}
            disabled={isStreamClosed}
          >
            Enviar
          </button>
        </div>

        <div>
          <button onClick={() => mockStream.close()} style={{ padding: '8px 12px', marginRight: '10px' }} disabled={isStreamClosed}>
            Fechar Stream
          </button>
          <button onClick={() => mockStream.error(new Error('Erro simulado'))} style={{ padding: '8px 12px' }} disabled={isStreamClosed}>
            Disparar Erro
          </button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <h4>Mensagens:</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
              {messages.map((msg, index) => (
                <li key={index} style={{ padding: '5px', borderBottom: index < messages.length - 1 ? '1px solid #ddd' : 'none' }}>
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

// --- Componente de Exemplo de Streaming de Texto Corrigido ---
const TextFileStreamingExample = () => {
  // Correção 1: Usar useState para a instância do mock.
  const [mockStream] = useState(() => new MockReadableStream());

  // Correção 2: Usar `useState` em vez de `createSignal`.
  const [content, setContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Correção 4: Usar useEffect para gerenciar o ciclo de vida do `setInterval`.
  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.`;
    const chunks = text.split(' ');
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < chunks.length) {
        mockStream.pushData(chunks[index] + ' ');
        index++;
        setProgress(Math.floor((index / chunks.length) * 100));
      } else {
        clearInterval(intervalId);
        mockStream.close();
      }
    }, 100);

    // Função de limpeza: será chamada se o componente for desmontado ou se `isStreaming` mudar.
    return () => {
      clearInterval(intervalId);
    };
  }, [isStreaming, mockStream]); // Depender de `isStreaming` para iniciar/parar.

  const startStreaming = () => {
    setContent('');
    setError(null);
    setProgress(0);
    setIsStreaming(true);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Exemplo de Streaming de Ficheiro de Texto</h3>
      <ReadableStream
        src={mockStream.getStream()}
        onChunk={(chunk) => {
          const text = new TextDecoder().decode(chunk);
          setContent(prev => prev + text);
        }}
        onDone={() => setIsStreaming(false)}
        onError={(err) => {
          setError(err.message || 'Erro desconhecido');
          setIsStreaming(false);
        }}
      >
        <button onClick={startStreaming} style={{ padding: '8px 12px' }} disabled={isStreaming}>
          Iniciar Streaming
        </button>

        {isStreaming && (
          <div style={{ margin: '15px 0' }}>
            <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: `${progress}%`, height: '10px', backgroundColor: '#4CAF50', transition: 'width 0.2s' }} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '5px' }}>{progress}% concluído</div>
          </div>
        )}

        {error && <div style={{ color: '#c62828', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', margin: '15px 0' }}>Erro: {error}</div>}

        <div style={{ marginTop: '10px' }}>
          <h4>Conteúdo do Ficheiro:</h4>
          <div style={{ height: '200px', overflowY: 'auto', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {content || 'Clique em "Iniciar Streaming" para começar.'}
          </div>
        </div>
      </ReadableStream>
    </div>
  );
};


// --- Histórias Exportadas ---

// Correção 5: Unificar a história "Basic" com a sua documentação.
//@ts-ignore
export const Basic: Story = {
  render: () => <BasicReadableStreamExample />,
  parameters: {
    docs: {
      description: {
        story: `
O componente \`ReadableStream\` oferece uma maneira declarativa e segura de consumir a Web Streams API em React. Ele abstrai a complexidade do ciclo de vida da stream (leitura, conclusão, erro e limpeza).

### Uso Básico

\`\`\`tsx
import { ReadableStream } from './components/ReadableStream';

const StreamExample = () => {
  // Obtenha uma ReadableStream de uma API (ex: fetch)
  const [stream, setStream] = useState(null);

  useEffect(() => {
    fetch('/api/data-stream').then(response => {
      setStream(response.body);
    });
  }, []);
  
  return (
    <ReadableStream 
      src={stream}
      onChunk={(chunk) => console.log('Chunk recebido:', new TextDecoder().decode(chunk))}
      onDone={() => console.log('Stream concluída!')}
      onError={(err) => console.error('Erro na stream:', err)}
    >
      <div>A sua UI pode ser renderizada aqui.</div>
    </ReadableStream>
  );
};
\`\`\`

### Funcionalidades

-   **Leitura Automática**: Inicia a leitura assim que a prop \`src\` é fornecida.
-   **Processamento de Chunks**: Executa a callback \`onChunk\` para cada pedaço de dado recebido.
-   **Gestão de Fim de Stream**: Executa a callback \`onDone\` quando a stream termina.
-   **Tratamento de Erros**: Executa a callback \`onError\` em caso de falha.
-   **Limpeza Automática**: Cancela a stream e libera os recursos quando o componente é desmontado ou a prop \`src\` muda, evitando memory leaks.
        `,
      },
    },
  },
};

// @ts-ignore
export const TextFileStreaming: Story = {
  render: () => <TextFileStreamingExample />,
};

// A história "WithDescription" foi removida porque a sua documentação
// foi fundida com a história "Basic", seguindo as melhores práticas do Storybook.