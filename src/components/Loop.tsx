// components/Loop.tsx
import React, { useSyncExternalStore } from 'react';
import { createSignal } from '../core/createSignal'; // Para inferência de tipos e acesso ao método 'subscribe'

type SignalGetter<T> = ReturnType<typeof createSignal<T>>[0];

interface LoopProps<T> {
  /**
   * O array a ser iterado. Pode ser:
   * 1. Um array comum (T[]): O Loop re-renderizará apenas se uma nova referência do array for passada pelo componente pai.
   * 2. Um getter de signal (SignalGetter<T[]>): O Loop reagirá automaticamente a mudanças no signal, garantindo re-renderizações granulares.
   */
  each: T[] | SignalGetter<T[]>;
  /**
   * Uma função que renderiza cada item do array.
   * Recebe o item, o índice e a 'key' gerada para o item (importante para React).
   */
  children: (item: T, index: number, key: React.Key) => React.ReactNode;
  /**
   * (Opcional) Uma função para extrair uma 'key' única de cada item.
   * Se não fornecido, o Loop tentará usar 'item.id' ou 'index' como fallback.
   */
  keyExtractor?: (item: T, index: number) => React.Key;
}

/**
 * Componente Loop declarativo e flexível.
 * Aceita tanto arrays comuns quanto signals de array para re-renderização granular.
 */
export function Loop<T>({ each, children, keyExtractor }: LoopProps<T>) {

  let currentArray: T[];

  // 1. Determina se 'each' é um signal getter (função com método 'subscribe')
  const isSignalGetter = typeof each === 'function' && typeof (each as any).subscribe === 'function';

  if (isSignalGetter) {
    const signalArrayGetter = each as SignalGetter<T[]>;

    // useSyncExternalStore para reatividade de signal
    const subscribe = React.useCallback((callback: () => void) => {
      const subscribeMethod = (signalArrayGetter as any).subscribe;
      if (typeof subscribeMethod === 'function') {
        return subscribeMethod(callback);
      }
      // Se chegar aqui, a detecção inicial falhou ou o signal é inválido.
      console.error("Loop: A prop 'each' foi detectada como uma função, mas não possui o método 'subscribe' de um signal válido. Verifique a implementação de createSignal.");
      return () => {};
    }, [signalArrayGetter]);

    const getSnapshot = React.useCallback(() => {
      return signalArrayGetter();
    }, [signalArrayGetter]);

    currentArray = useSyncExternalStore(subscribe, getSnapshot);

  } else {
    // 2. Se 'each' é um array comum, usa-o diretamente
    currentArray = each as T[];
    // O AVISO PRECISA ESTAR AQUI E SER DISPARADO PELO useEffect
    // O useEffect agora depende de `isSignalGetter` para controlar o aviso.
    // Ele será disparado se `isSignalGetter` mudar ou na montagem inicial.
    React.useEffect(() => {
      if (!isSignalGetter) { // A condição correta para o aviso
        console.warn(
          "Loop: Você está usando um array comum para a prop 'each'. Este Loop não reagirá automaticamente a mudanças internas no array. Ele só re-renderizará se o array for uma nova referência passada pelo componente pai. Para reatividade automática, use um signal."
        );
      }
      // O return é para limpeza, no caso de useEffects mais complexos
      // ou se a prop `each` pudesse mudar entre signal e array comum.
      return () => {};
    }, [isSignalGetter, each]); // Adicione `each` como dependência para reavaliação se a prop mudar
  }

  // --- Lógica de Geração de Keys (mantida como antes) ---
  const getRenderKey = React.useCallback((item: T, index: number): React.Key => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }
    if (typeof item === 'object' && item !== null && 'id' in item &&
      (typeof (item as any).id === 'string' || typeof (item as any).id === 'number')) {
      return (item as any).id;
    }
    console.warn(`Loop: Missing 'keyExtractor' prop for item at index ${index}. Falling back to index as key. This can lead to performance issues and bugs if the list order changes or items are added/removed from the middle. Consider adding a unique 'id' to your items or providing a 'keyExtractor' function.`);
    return index;
  }, [keyExtractor]);


  return (
    <>
      {currentArray.map((item, i) => {
        const key = getRenderKey(item, i);
        return children(item, i, key);
      })}
    </>
  );
}