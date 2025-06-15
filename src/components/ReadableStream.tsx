// components/Rf/ReadableStream.tsx
import React, { useEffect } from 'react';

interface ReadableStreamProps {
  src: ReadableStream<Uint8Array> | null;
  children?: React.ReactNode;
  onChunk?: (chunk: Uint8Array) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
}

export function ReadableStream({ src, onChunk, onDone, onError, children }: ReadableStreamProps) {
  useEffect(() => {
    if (!src) return;

    const reader = src.getReader();

    let cancelled = false;

    const read = async () => {
      try {
        while (!cancelled) {
          const { done, value } = await reader.read();
          if (done) {
            onDone?.();
            break;
          }
          if (value) {
            onChunk?.(value);
          }
        }
      } catch (err) {
        onError?.(err);
      } finally {
        reader.releaseLock();
      }
    };

    read();

    return () => {
      cancelled = true;
      reader.cancel().catch(() => {});
    };
  }, [src, onChunk, onDone, onError]);

  return <>{children}</>;
}
