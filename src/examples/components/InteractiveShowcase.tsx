import React, { useRef } from 'react';
import { createEffect, Signal } from '../../core/signals';
import { useSignal } from '../../hooks/useSignal';
import { S } from '../../components/S';
import { VirtualList } from '../../components/VirtualList.tsx';
import { HeavyComponent, generateItems } from '../utils/helpers';

// --- Interactive Showcase Example ---
const InteractiveShowcase = () => {
  const listRef = useRef<any>(null);
  const itemCount = useSignal(9_999); // Começa com 1 milhão de itens
  const items = useSignal(generateItems(itemCount.peek()));

  // Efeito para re-gerar a lista quando o itemCount muda
  createEffect(() => {
    items.set(generateItems(itemCount.get()));
  });

  const handleScrollTo = (target: 'top' | 'middle' | 'bottom' | 'random') => {
    if (!listRef.current) return;
    const count = itemCount.peek();
    let index = 0;
    switch(target) {
      case 'top':
        index = 0;
        break;
      case 'middle':
        index = Math.floor(count / 2);
        break;
      case 'bottom':
        index = count - 1;
        break;
      case 'random':
        index = Math.floor(Math.random() * count);
        break;
    }
    listRef.current.scrollToIndex(index, { align: 'center' });
  };

  const addItems = (position: 'top' | 'bottom') => {
    const currentItems = items.peek();
    const newItems = generateItems(10, position === 'top' ? (currentItems[0]?.id || 0) - 10 : currentItems.length);
    items.set(position === 'top' ? [...newItems, ...currentItems] : [...currentItems, ...newItems]);
    itemCount.set(items.peek().length);
  };

  return (
    <div className="p-4 w-full h-screen flex flex-col items-center bg-gray-50 font-sans">
      <div className="w-full max-w-2xl flex flex-col h-full">
        <header className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Vitrine Interativa da VirtualList</h3>
          <p className="text-sm text-gray-600">
            Esta lista renderiza virtualmente <strong className="text-blue-600 font-semibold"><S>{itemCount}</S></strong> itens com alturas variáveis e alguns componentes "pesados".
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button onClick={() => handleScrollTo('top')} className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Ir para o Topo</button>
          <button onClick={() => handleScrollTo('middle')} className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Ir para o Meio</button>
          <button onClick={() => handleScrollTo('random')} className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Ir para Aleatório</button>
          <button onClick={() => handleScrollTo('bottom')} className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300">Ir para o Fim</button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => addItems('top')} className="p-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600">Adicionar 10 no Topo</button>
          <button onClick={() => addItems('bottom')} className="p-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600">Adicionar 10 no Fim</button>
        </div>

        <div className="border border-gray-300 rounded-lg flex-grow shadow-inner bg-white">
          <VirtualList ref={listRef} items={items} height={500} estimatedItemHeight={50}>
            {(item) => (
              <div
                className="p-3 border-b border-gray-200 flex flex-col justify-center"
                style={{ height: item.height, backgroundColor: item.color }}
              >
                <div className="flex items-center">
                  <span className="font-mono text-xs text-gray-500 w-20"># {item.id}</span>
                  <span className="font-bold text-sm text-gray-800">{item.title}</span>
                  {item.isHeavy && <span className="ml-2 text-xs font-bold text-red-600">(Componente Pesado)</span>}
                </div>
                {item.isHeavy && <HeavyComponent />}
              </div>
            )}
          </VirtualList>
        </div>
        <footer className="text-center text-xs text-gray-500 pt-2">
          O navegador renderiza apenas os itens visíveis, evitando travamentos mesmo com milhões de linhas.
        </footer>
      </div>
    </div>
  );
};

export default InteractiveShowcase;