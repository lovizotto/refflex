import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { Signal } from '../core/signals';
import { useSignalValue } from '../hooks/useSignal';

// Helper to check for a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return typeof val === 'object' && val !== null && 'get' in val && 'subscribe' in val;
}

// Fenwick Tree (BIT) for dynamic prefix sums of item heights
class Fenwick {
  tree: number[];
  constructor(size: number) {
    this.tree = Array(size + 1).fill(0);
  }

  update(i: number, delta: number) {
    for (i += 1; i < this.tree.length; i += i & -i) {
      this.tree[i] += delta;
    }
  }

  query(i: number): number {
    let s = 0;
    for (i += 1; i > 0; i -= i & -i) {
      s += this.tree[i];
    }
    return s;
  }

  // Finds the first item whose cumulative height is >= value
  lowerBound(value: number): number {
    let idx = 0;
    let bit = 1 << (31 - Math.clz32(this.tree.length -1 || 1));
    while (bit > 0) {
      const next = idx + bit;
      if (next < this.tree.length && this.tree[next] < value) {
        value -= this.tree[next];
        idx = next;
      }
      bit >>= 1;
    }
    return idx;
  }
}

interface VirtualListHandle {
  scrollToIndex: (index: number, options?: { align: 'start' | 'center' | 'end' }) => void;
}

interface VirtualListProps<T> {
  items: T[] | Signal<T[]>;
  height: number;
  overscan?: number;
  estimatedItemHeight?: number;
  children: (item: T, index: number) => React.ReactElement;
}

export const VirtualList = forwardRef(function <T>(
  {
    items: itemsProp,
    height,
    overscan = 5,
    estimatedItemHeight = 40,
    children,
  }: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>
) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use a reactive value for the items list
  const items = isSignal(itemsProp) ? useSignalValue(itemsProp) : itemsProp;

  const [scrollTop, setScrollTop] = useState(0);

  // Store heights and the Fenwick tree in refs to avoid re-renders on every measurement
  const measuredHeights = useRef<Map<React.Key, number>>(new Map());
  const fenwickRef = useRef<Fenwick>(new Fenwick(items.length));

  // Recalculate total height whenever items or their heights change
  const totalHeight = useMemo(() => {
    fenwickRef.current = new Fenwick(items.length);
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      const key = (items[i] as any).id ?? i;
      const h = measuredHeights.current.get(key) ?? estimatedItemHeight;
      fenwickRef.current.update(i, h);
      total += h;
    }
    return total;
  }, [items, estimatedItemHeight]);

  // Handle scroll events
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // API for scrolling to a specific index
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index, options = { align: 'start' }) => {
      const container = containerRef.current;
      if (!container) return;

      const itemTop = index > 0 ? fenwickRef.current.query(index - 1) : 0;
      const itemHeight = (measuredHeights.current.get((items[index] as any).id ?? index) ?? estimatedItemHeight);

      let newScrollTop = itemTop;

      if (options.align === 'center') {
        newScrollTop = itemTop - (container.clientHeight / 2) + (itemHeight / 2);
      } else if (options.align === 'end') {
        newScrollTop = itemTop - container.clientHeight + itemHeight;
      }

      container.scrollTo({ top: newScrollTop, behavior: 'smooth' });
    }
  }));

  // Logic to calculate the visible range of items
  const start = Math.max(0, fenwickRef.current.lowerBound(scrollTop) - overscan);
  const end = Math.min(items.length, fenwickRef.current.lowerBound(scrollTop + height) + overscan * 2);
  const paddingTop = start > 0 ? fenwickRef.current.query(start - 1) : 0;

  // Set up a ResizeObserver to measure the actual height of rendered items
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      let hasChanges = false;
      for (const entry of entries) {
        const index = Number((entry.target as HTMLElement).dataset.index);
        if (isNaN(index)) continue;

        const key = (items[index] as any).id ?? index;
        const newHeight = entry.borderBoxSize[0].blockSize;

        if (measuredHeights.current.get(key) !== newHeight) {
          const oldHeight = measuredHeights.current.get(key) ?? estimatedItemHeight;
          fenwickRef.current.update(index, newHeight - oldHeight);
          measuredHeights.current.set(key, newHeight);
          hasChanges = true;
        }
      }
      if(hasChanges){
        // Force a re-render to apply the new total height
        setScrollTop(prev => prev);
      }
    });
    observerRef.current = ro;
    return () => ro.disconnect();
  }, [items, estimatedItemHeight]);

  const observe = useCallback(
    (el: HTMLElement | null, idx: number) => {
      const ro = observerRef.current;
      if (el && ro) {
        el.dataset.index = String(idx);
        ro.observe(el);
      }
    },
    []
  );

  return (
    <div ref={containerRef} onScroll={onScroll} style={{ height, overflowY: 'auto', position: 'relative' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${paddingTop}px)`, position: 'absolute', width: '100%' }}>
          {items.slice(start, end).map((item, i) => {
            const index = start + i;
            const key = (item as any).id ?? index;
            const element = children(item, index);
            return React.cloneElement(element, {
              key,
              ref: (node: HTMLElement) => observe(node, index),
            });
          })}
        </div>
      </div>
    </div>
  );
});
