// components/WebSocketProvider.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';

// CORREÇÃO: O socket pode ser nulo durante a inicialização.
interface WebSocketContextValue {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export interface WebSocketProviderProps {
  url: string;
  children: ReactNode;
}

/**
 * WebSocketProvider
 * — Inicializa o WebSocket na montagem e re-abre se a URL mudar.
 * — Fecha o socket ao desmontar.
 * — Exibe erro se usado sem um <WebSocketProvider>.
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                      url,
                                                                      children,
                                                                    }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    return () => {
      // Garante que o socket seja fechado ao desmontar o componente ou ao mudar a URL.
      ws.close();
    };
  }, [url]);

  // CORREÇÃO: O Provider deve sempre ser renderizado para que o contexto esteja
  // disponível para os componentes filhos, mesmo que o socket ainda seja `null`.
  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

/**
 * useWebSocket
 * — Hook para acessar o WebSocket instanciado.
 * — Lança erro se não for chamado dentro do provider.
 */
// CORREÇÃO: O hook agora pode retornar `null` se o socket ainda não estiver pronto.
export function useWebSocket(): WebSocket | null {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error(
      'useWebSocket must be used within a <WebSocketProvider>',
    );
  }
  return ctx.socket;
}

// ------------------------------------------------------------------------------------------------
// Event handler components
// ------------------------------------------------------------------------------------------------

/** Props genéricas para handlers de WebSocket */
interface HandlerProps<EventType> {
  // A prop `children` é uma função que recebe o evento.
  children: (ev: EventType) => void;
}

/**
 * OnMessage
 * — Adiciona um listener em "message" e limpa ao desmontar.
 */
export const OnMessage: React.FC<HandlerProps<MessageEvent>> = ({
                                                                  children: onMessage,
                                                                }) => {
  const socket = useWebSocket();
  // Memoiza a função de callback para evitar recriações desnecessárias.
  const handler = useCallback((ev: MessageEvent) => onMessage(ev), [onMessage]);

  useEffect(() => {
    // CORREÇÃO: Adiciona o listener apenas se o socket já estiver instanciado.
    // O efeito será re-executado quando o socket mudar de `null` para uma instância de WebSocket.
    if (!socket) return;

    socket.addEventListener('message', handler);
    return () => {
      socket.removeEventListener('message', handler);
    };
  }, [socket, handler]); // Depende do socket para reagir à sua criação.

  return null; // Este componente não renderiza nada na DOM.
};

/**
 * OnOpen
 * — Adiciona um listener em "open" e limpa ao desmontar.
 */
export const OnOpen: React.FC<HandlerProps<Event>> = ({
                                                        children: onOpen,
                                                      }) => {
  const socket = useWebSocket();
  // CORREÇÃO: O evento `ev` deve ser repassado para a função de callback `onOpen`.
  const handler = useCallback((ev: Event) => onOpen(ev), [onOpen]);

  useEffect(() => {
    // CORREÇÃO: Garante que o socket não é nulo.
    if (!socket) return;

    socket.addEventListener('open', handler);
    return () => {
      socket.removeEventListener('open', handler);
    };
  }, [socket, handler]);

  return null;
};

/**
 * OnClose
 * — Adiciona um listener em "close" e limpa ao desmontar.
 */
export const OnClose: React.FC<HandlerProps<CloseEvent>> = ({
                                                              children: onClose,
                                                            }) => {
  const socket = useWebSocket();
  // CORREÇÃO: O evento `ev` deve ser repassado para a função de callback `onClose`.
  const handler = useCallback((ev: CloseEvent) => onClose(ev), [onClose]);

  useEffect(() => {
    // CORREÇÃO: Garante que o socket não é nulo.
    if (!socket) return;

    socket.addEventListener('close', handler);
    return () => {
      socket.removeEventListener('close', handler);
    };
  }, [socket, handler]);

  return null;
};