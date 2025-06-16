import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
  ReactElement,
} from "react";
import { Signal } from "../core/signals";
import { useSignalValue } from "../hooks/useSignal";

// Helper to check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    "get" in val &&
    "subscribe" in val
  );
}

// Fenwick Tree (BIT) remains the same, as it's an efficient data structure for this purpose.
class Fenwick {
  tree: number[];
  constructor(size: number) {
    this.tree = Array(size + 1).fill(0);
  }
  update(i: number, delta: number) {
    for (i += 1; i < this.tree.length; i += i & -i) this.tree[i] += delta;
  }
  query(i: number): number {
    let s = 0;
    for (i += 1; i > 0; i -= i & -i) s += this.tree[i];
    return s;
  }
  lowerBound(value: number): number {
    let idx = 0;
    let bit =
      this.tree.length > 1 ? 1 << (31 - Math.clz32(this.tree.length - 1)) : 0;
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
  scrollToIndex: (
    index: number,
    options?: { align: "start" | "center" | "end" },
  ) => void;
}

interface VirtualListProps<T> {
  items: T[] | Signal<T[]>;
  height: number;
  overscan?: number;
  estimatedItemHeight?: number;
  children: (item: T, index: number) => ReactElement;
}

export const VirtualList = forwardRef(function <T>(
  {
    items: itemsProp,
    height,
    overscan = 5,
    estimatedItemHeight = 40,
    children,
  }: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = isSignal(itemsProp) ? useSignalValue(itemsProp) : itemsProp;
  const [scrollTop, setScrollTop] = useState(0);
  // This revision state is used to trigger re-renders when measured heights change.
  const [revision, setRevision] = useState(0);

  const measuredHeights = useRef<Map<React.Key, number>>(new Map());

  // All calculations are memoized and will only re-run when necessary.
  const { virtualItems, totalHeight, paddingTop, fenwick } = useMemo(() => {
    const fenwickInstance = new Fenwick(items.length);
    let total = 0;

    // Build the Fenwick tree with either measured heights or estimates.
    for (let i = 0; i < items.length; i++) {
      const key = (items[i] as any).id ?? i;
      const h = measuredHeights.current.get(key) ?? estimatedItemHeight;
      fenwickInstance.update(i, h);
      total += h;
    }

    // Calculate the visible range
    const start = Math.max(0, fenwickInstance.lowerBound(scrollTop) - overscan);
    const end = Math.min(
      items.length,
      fenwickInstance.lowerBound(scrollTop + height) + overscan * 2,
    );
    const top = start > 0 ? fenwickInstance.query(start - 1) : 0;

    const virtual = items.slice(start, end).map((item, i) => {
      const index = start + i;
      const key = (item as any).id ?? index;
      return {
        ...children(item, index),
        key, // Ensure key is set for React's reconciliation
      };
    });

    return {
      virtualItems: virtual,
      totalHeight: total,
      paddingTop: top,
      fenwick: fenwickInstance,
    };
  }, [
    items,
    scrollTop,
    revision,
    height,
    overscan,
    estimatedItemHeight,
    children,
  ]);

  // The ResizeObserver measures items and updates our measured heights.
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      let hasChanges = false;
      for (const entry of entries) {
        const key = (entry.target as HTMLElement).dataset.key;
        if (!key) continue;

        const newHeight = entry.borderBoxSize[0].blockSize;
        if (measuredHeights.current.get(key) !== newHeight) {
          measuredHeights.current.set(key, newHeight);
          hasChanges = true;
        }
      }
      // If any heights changed, increment revision to trigger a recalculation.
      if (hasChanges) {
        setRevision((r) => r + 1);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []); // The observer is created only once.

  // This callback attaches the observer to the rendered elements.
  const observe = useCallback((el: HTMLElement | null) => {
    if (el) {
      observerRef.current?.observe(el);
    }
  }, []);

  // Expose the scrollToIndex function via ref.
  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index, options = { align: "start" }) => {
        const container = containerRef.current;
        if (!container || !items[index]) return;

        const key = (items[index] as any).id ?? index;
        // Use the up-to-date fenwick instance from the useMemo calculation.
        const itemTop = index > 0 ? fenwick.query(index - 1) : 0;
        const itemHeight =
          measuredHeights.current.get(key) ?? estimatedItemHeight;

        let newScrollTop = itemTop;
        if (options.align === "center") {
          newScrollTop = itemTop - container.clientHeight / 2 + itemHeight / 2;
        } else if (options.align === "end") {
          newScrollTop = itemTop - container.clientHeight + itemHeight;
        }

        container.scrollTo({ top: newScrollTop, behavior: "smooth" });
      },
    }),
    [items, fenwick],
  ); // Add fenwick to the dependency array.

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height, overflowY: "auto", position: "relative" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${paddingTop}px)`,
            position: "absolute",
            width: "100%",
          }}
        >
          {virtualItems.map((element) => {
            // Clone element to attach the ref for the observer.
            return React.cloneElement(element, {
              ref: observe,
              "data-key": element.key,
            });
          })}
        </div>
      </div>
    </div>
  );
});
