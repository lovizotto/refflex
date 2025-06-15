// components/Rf/ReadableStream.tsx
import React, { useEffect, useRef } from 'react';

interface ReadableStreamProps {
  src: ReadableStream<Uint8Array> | null;
  children?: React.ReactNode;
  onChunk?: (chunk: Uint8Array) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
}

export function ReadableStream({ src, onChunk, onDone, onError, children }: ReadableStreamProps) {
  // 1. Usar refs para armazenar as callbacks mais recentes.
  // Isso evita que o useEffect principal seja acionado a cada renderização do componente pai.
  const onChunkRef = useRef(onChunk);
  const onDoneRef = useRef(onDone);
  const onErrorRef = useRef(onError);

  // Atualiza as refs a cada renderização para garantir que sempre tenhamos a última versão das funções.
  useEffect(() => {
    onChunkRef.current = onChunk;
    onDoneRef.current = onDone;
    onErrorRef.current = onError;
  });

  // 2. O useEffect principal agora depende APENAS de `src`.
  // A lógica de leitura só será reiniciada se a stream de origem for trocada.
  useEffect(() => {
    if (!src) {
      return;
    }

    const controller = new AbortController();
    const reader = src.getReader();

    const read = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();

          if (controller.signal.aborted) {
            break;
          }

          if (done) {
            // 3. Chamar a callback a partir da ref.
            onDoneRef.current?.();
            break;
          }

          if (value) {
            // 3. Chamar a callback a partir da ref.
            onChunkRef.current?.(value);
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          // 3. Chamar a callback a partir da ref.
          onErrorRef.current?.(err);
        }
      } finally {
        reader.releaseLock();
      }
    };

    read();

    return () => {
      controller.abort();
      reader.cancel('Component unmounted').catch(() => {});
    };
  }, [src]); // A única dependência é `src`!

  return <>{children}</>;
}