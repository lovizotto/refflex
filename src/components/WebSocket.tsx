// components/Rf/WebSocket.tsx
import React, { useEffect, useRef, createContext, useContext, useState } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocket({ url, children }: { url: string; children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(url);
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Update the div's value property whenever the socket changes
    if (divRef.current) {
      (divRef.current as any).value = newSocket;
    }

    return () => {
      newSocket.close();
      setSocket(null);

      // Clear the div's value property when the component unmounts
      if (divRef.current) {
        (divRef.current as any).value = null;
      }
    };
  }, [url]);

  // Update the div's value property whenever the socket changes
  useEffect(() => {
    if (divRef.current) {
      (divRef.current as any).value = socket;
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={socket}>
      <div data-testid="websocket" style={{ display: 'none' }} ref={divRef} />
      {children}
    </WebSocketContext.Provider>
  );
}

export function OnMessage({ children }: { children: (ev: MessageEvent) => void }) {
  const socket = useContext(WebSocketContext);
  useEffect(() => {
    if (!socket) return;
    const handler = (ev: MessageEvent) => children(ev);
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [socket]);
  return null;
}

export function OnOpen({ children }: { children: () => void }) {
  const socket = useContext(WebSocketContext);
  useEffect(() => {
    if (!socket) return;
    const handler = () => children();
    socket.addEventListener('open', handler);
    return () => socket.removeEventListener('open', handler);
  }, [socket]);
  return null;
}

export function OnClose({ children }: { children: () => void }) {
  const socket = useContext(WebSocketContext);
  useEffect(() => {
    if (!socket) return;
    const handler = () => children();
    socket.addEventListener('close', handler);
    return () => socket.removeEventListener('close', handler);
  }, [socket]);
  return null;
}
