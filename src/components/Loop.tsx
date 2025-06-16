// // components/Loop.tsx
// import React, { useSyncExternalStore } from 'react';
// import { createSignal } from '../core/createSignal'; // Para inferência de tipos e acesso ao método 'subscribe'
//
// type SignalGetter<T> = ReturnType<typeof createSignal<T>>[0];
//
// interface LoopProps<T> {
//   /**
//    * O array a ser iterado. Pode ser:
//    * 1. Um array comum (T[]): O Loop re-renderizará apenas se uma nova referência do array for passada pelo componente pai.
//    * 2. Um getter de signal (SignalGetter<T[]>): O Loop reagirá automaticamente a mudanças no signal, garantindo re-renderizações granulares.
//    */
//   each: T[] | SignalGetter<T[]>;
//   /**
//    * Uma função que renderiza cada item do array.
//    * Recebe o item, o índice e a 'key' gerada para o item (importante para React).
//    */
//   children: (item: T, index: number, key: React.Key) => React.ReactNode;
//   /**
//    * (Opcional) Uma função para extrair uma 'key' única de cada item.
//    * Se não fornecido, o Loop tentará usar 'item.id' ou 'index' como fallback.
//    */
//   keyExtractor?: (item: T, index: number) => React.Key;
// }
//
// /**
//  * Componente Loop declarativo e flexível.
//  * Aceita tanto arrays comuns quanto signals de array para re-renderização granular.
//  */
// export function Loop<T>({ each, children, keyExtractor }: LoopProps<T>) {
//
//   let currentArray: T[];
//
//   // 1. Determina se 'each' é um signal getter (função com método 'subscribe')
//   const isSignalGetter = typeof each === 'function' && typeof (each as any).subscribe === 'function';
//
//   if (isSignalGetter) {
//     const signalArrayGetter = each as SignalGetter<T[]>;
//
//     // useSyncExternalStore para reatividade de signal
//     const subscribe = React.useCallback((callback: () => void) => {
//       const subscribeMethod = (signalArrayGetter as any).subscribe;
//       if (typeof subscribeMethod === 'function') {
//         return subscribeMethod(callback);
//       }
//       // Se chegar aqui, a detecção inicial falhou ou o signal é inválido.
//       console.error("Loop: A prop 'each' foi detectada como uma função, mas não possui o método 'subscribe' de um signal válido. Verifique a implementação de createSignal.");
//       return () => {};
//     }, [signalArrayGetter]);
//
//     const getSnapshot = React.useCallback(() => {
//       return signalArrayGetter();
//     }, [signalArrayGetter]);
//
//     currentArray = useSyncExternalStore(subscribe, getSnapshot);
//
//   } else {
//     // 2. Se 'each' é um array comum, usa-o diretamente
//     currentArray = each as T[];
//     // O AVISO PRECISA ESTAR AQUI E SER DISPARADO PELO useEffect
//     // O useEffect agora depende de `isSignalGetter` para controlar o aviso.
//     // Ele será disparado se `isSignalGetter` mudar ou na montagem inicial.
//     React.useEffect(() => {
//       if (!isSignalGetter) { // A condição correta para o aviso
//         console.warn(
//           "Loop: Você está usando um array comum para a prop 'each'. Este Loop não reagirá automaticamente a mudanças internas no array. Ele só re-renderizará se o array for uma nova referência passada pelo componente pai. Para reatividade automática, use um signal."
//         );
//       }
//       // O return é para limpeza, no caso de useEffects mais complexos
//       // ou se a prop `each` pudesse mudar entre signal e array comum.
//       return () => {};
//     }, [isSignalGetter, each]); // Adicione `each` como dependência para reavaliação se a prop mudar
//   }
//
//   // --- Lógica de Geração de Keys (mantida como antes) ---
//   const getRenderKey = React.useCallback((item: T, index: number): React.Key => {
//     if (keyExtractor) {
//       return keyExtractor(item, index);
//     }
//     if (typeof item === 'object' && item !== null && 'id' in item &&
//       (typeof (item as any).id === 'string' || typeof (item as any).id === 'number')) {
//       return (item as any).id;
//     }
//     console.warn(`Loop: Missing 'keyExtractor' prop for item at index ${index}. Falling back to index as key. This can lead to performance issues and bugs if the list order changes or items are added/removed from the middle. Consider adding a unique 'id' to your items or providing a 'keyExtractor' function.`);
//     return index;
//   }, [keyExtractor]);
//
//
//   return (
//     <>
//       {currentArray.map((item, i) => {
//         const key = getRenderKey(item, i);
//         return children(item, i, key);
//       })}
//     </>
//   );
// }

import React from 'react';
import { Signal } from '../core/signals';
import { useSignalValue } from '../hooks/useSignal';

interface LoopProps<T> {
  /**
   * The array to iterate over. It can be:
   * 1. A plain array (T[]): The Loop will only re-render if a new array reference is passed from the parent.
   * 2. A signal (Signal<T[]>): The Loop will automatically react to changes in the signal, ensuring granular re-renders.
   */
  each: T[] | Signal<T[]>;
  /**
   * A function that renders each item of the array.
   * Receives the item and its index.
   */
  children: (item: T, index: number) => React.ReactNode;
  /**
   * (Optional) A function to extract a unique key from each item.
   * If not provided, the Loop will try to use 'item.id' or the index as a fallback.
   */
  keyExtractor?: (item: T, index: number) => React.Key;
}

/**
 * A declarative and flexible Loop component.
 * It accepts both plain arrays and array signals for granular re-rendering.
 */
export function Loop<T>({ each, children, keyExtractor }: LoopProps<T>) {
  // 1. Unconditionally check if 'each' is a signal.
  // This check is robust for the new signal object structure.
  const isSignal = typeof each === 'object' && each !== null && 'get' in each && 'subscribe' in each;

  // 2. Unconditionally get the array value.
  // The useSignalValue hook is called at the top level, respecting the Rules of Hooks.
  // The conditional logic is inside the expression, which is perfectly fine.
  const items = isSignal ? useSignalValue(each as Signal<T[]>) : (each as T[]);

  // 3. Unconditionally run an effect for warnings.
  React.useEffect(() => {
    if (!isSignal) {
      console.warn(
        "Loop: You are using a plain array for the 'each' prop. This component will not automatically react to mutations of the array. It will only re-render if the parent passes a new array reference. For automatic reactivity, use a signal."
      );
    }
  }, [isSignal, each]); // Dependency array ensures this runs only when necessary.

  // 4. Unconditionally define the key extraction logic.
  const getRenderKey = React.useCallback((item: T, index: number): React.Key => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }
    if (typeof item === 'object' && item !== null && 'id' in item &&
      (typeof (item as any).id === 'string' || typeof (item as any).id === 'number')) {
      return (item as any).id;
    }
    return index; // Fallback to index if no key is found.
  }, [keyExtractor]);

  return (
    <>
      {items.map((item, index) => {
        const key = getRenderKey(item, index);
        // The key is applied here directly, not passed down to children.
        // Using a Fragment ensures we can apply a key without adding an extra DOM element.
        return <React.Fragment key={key}>{children(item, index)}</React.Fragment>;
      })}
    </>
  );
}
