// components/Rf/VirtualList.tsx
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

//
// Fenwick Tree (BIT) para prefix sums dinâmicas
//
class Fenwick {
  n: number;
  tree: number[];
  constructor(n: number) {
    this.n = n;
    this.tree = Array(n + 1).fill(0);
  }
  // inicializa a estrutura com um array de alturas
  init(arr: number[]) {
    for (let i = 0; i < this.n; i++) {
      this.update(i, arr[i]);
    }
  }
  // adiciona `delta` na posição i
  update(i: number, delta: number) {
    for (i += 1; i <= this.n; i += i & -i) {
      this.tree[i] += delta;
    }
  }
  // soma de [0..i]
  query(i: number): number {
    let s = 0;
    for (i += 1; i > 0; i -= i & -i) {
      s += this.tree[i];
    }
    return s;
  }
  // encontra o maior índice idx tal que query(idx) < value
  // (procura o prefixo cujo total é menor que o scrollTop)
  lowerBound(value: number): number {
    let idx = 0;
    // maior potência de 2 ≤ n
    let bit = 1 << (31 - Math.clz32(this.n));
    while (bit > 0) {
      const next = idx + bit;
      if (next <= this.n && this.tree[next] < value) {
        value -= this.tree[next];
        idx = next;
      }
      bit >>= 1;
    }
    return idx; // idx já é 1-based no tree, mas queremos 0-based
  }
}

interface VirtualListProps<T> {
  items: T[];
  height: number;
  overscan?: number;
  estimatedItemHeight?: number;
  scrollToIndex?: number;
  children: (item: T, index: number) => React.ReactElement;
}

export const VirtualList = forwardRef(function <T>(
  {
    items,
    height,
    overscan = 5,
    estimatedItemHeight = 40,
    scrollToIndex,
    children,
  }: VirtualListProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const containerRef = useRef<HTMLDivElement>(null);

  // alturas e Fenwick em refs para não causar re-render em cada update
  const heightsRef = useRef<number[]>(items.map(() => estimatedItemHeight));
  const fenwickRef = useRef<Fenwick>(new Fenwick(items.length));
  const [scrollTop, setScrollTop] = useState(0);
  // forçar re-render quando a árvore muda em um ponto importante
  const [, bump] = useState({});

  // inicializa Fenwick na mount e quando `items` ou `estimatedItemHeight` mudar
  useEffect(() => {
    // Ensure we have valid items
    if (items.length > 0) {
      heightsRef.current = items.map(() => estimatedItemHeight);
      fenwickRef.current = new Fenwick(items.length);
      fenwickRef.current.init(heightsRef.current);
      bump({});
    } else {
      // Handle empty items case
      heightsRef.current = [];
      fenwickRef.current = new Fenwick(0);
      bump({});
    }
  }, [items, estimatedItemHeight]);

  // medida completa: inclui margin, border, padding
  const measure = useCallback((el: Element): number => {
    const r = (el as HTMLElement).getBoundingClientRect().height;
    const s = getComputedStyle(el as Element);
    const m =
      (parseFloat(s.marginTop) || 0) + (parseFloat(s.marginBottom) || 0);
    return r + m;
  }, []);

  // ResizeObserver para todos os itens renderizados
  const ro = useRef<ResizeObserver>();
  useEffect(() => {
    ro.current = new ResizeObserver((entries) => {
      let hasChanges = false;
      entries.forEach((ent) => {
        const idx = Number((ent.target as HTMLElement).dataset.index);
        if (isNaN(idx) || idx < 0 || idx >= items.length) return;

        const h = measure(ent.target);
        const old = heightsRef.current[idx];
        if (h > 0 && old !== h) {
          heightsRef.current[idx] = h;
          fenwickRef.current.update(idx, h - old);
          hasChanges = true;
        }
      });

      // Only trigger re-render if there were actual changes
      if (hasChanges) {
        bump({});
      }
    });
    return () => ro.current?.disconnect();
  }, [measure, items.length]);

  // scroll handler
  useImperativeHandle(ref, () => containerRef.current!);
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    // Only update if the scroll position has actually changed
    if (newScrollTop !== scrollTop) {
      setScrollTop(newScrollTop);
    }
  }, [scrollTop]);

  // scroll to index
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current && items.length > 0) {
      // Ensure scrollToIndex is within bounds
      const validIndex = Math.max(0, Math.min(scrollToIndex, items.length - 1));

      // Calculate the position to scroll to using the Fenwick tree
      const position = validIndex > 0 ? fenwickRef.current.query(validIndex - 1) : 0;

      // Add a small offset to ensure the item is fully visible
      containerRef.current.scrollTop = position;

      // Force a re-render to ensure the correct items are displayed
      bump({});
    }
  }, [scrollToIndex, items.length]);

  // calcula índices visíveis via Fenwick.lowerBound
  // Ensure we have a valid Fenwick tree and items
  const hasItems = items.length > 0;
  const start = hasItems ? Math.max(0, fenwickRef.current.lowerBound(scrollTop) - overscan) : 0;
  const end = hasItems ? Math.min(
    items.length,
    fenwickRef.current.lowerBound(scrollTop + height) + overscan
  ) : 0;

  // helper pra observar cada nó
  const observe = useCallback(
    (el: HTMLDivElement | null, idx: number) => {
      if (el) {
        el.dataset.index = String(idx);
        ro.current?.observe(el);
      }
    },
    []
  );

  // altura total
  const total = hasItems ? fenwickRef.current.query(items.length - 1) : 0;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height, overflowY: 'auto' }}
    >
      {/* spacer-top */}
      <div 
        style={{ 
          height: start > 0 && hasItems ? Math.max(0, fenwickRef.current.query(start - 1)) : 0,
          minHeight: 0
        }} 
      />

      {items.slice(start, end).map((item, i) => {
        const idx = start + i;
        const el = children(item, idx);
        return React.cloneElement(el, {
          key: (item as any).id ?? idx,
          ref: (node: HTMLDivElement) => observe(node, idx),
        });
      })}

      {/* spacer-bottom */}
      <div 
        style={{ 
          height: end > 0 && hasItems ? Math.max(0, total - fenwickRef.current.query(end - 1)) : total,
          minHeight: 0
        }} 
      />
    </div>
  );
});
