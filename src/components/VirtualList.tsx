// components/Rf/VirtualList.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef
} from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  overscan?: number;
  estimatedItemHeight?: number;
  scrollToIndex?: number;
  children: (item: T, index: number) => React.ReactElement;
}

export const VirtualList = forwardRef(<T,>(
  {
    items,
    height,
    overscan = 5,
    estimatedItemHeight = 40,
    scrollToIndex,
    children,
  }: VirtualListProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [scrollTop, setScrollTop] = useState(0);
  const [heights, setHeights] = useState<number[]>(items.map(() => estimatedItemHeight));

  const getTotalHeight = () => heights.reduce((acc, h) => acc + h, 0);

  const measureHeights = () => {
    const newHeights = items.map((_, index) => {
      const el = itemRefs.current[index];
      return el?.offsetHeight || estimatedItemHeight;
    });
    setHeights(newHeights);
  };

  useLayoutEffect(() => {
    measureHeights();
  }, [items]);

  useImperativeHandle(ref, () => containerRef.current as HTMLDivElement, []);

  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const offset = heights.slice(0, scrollToIndex).reduce((a, b) => a + b, 0);
      containerRef.current.scrollTop = offset;
    }
  }, [scrollToIndex, heights]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const current = containerRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
      return () => current.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  let offset = 0;
  let startIndex = 0;
  let endIndex = items.length;

  for (let i = 0; i < items.length; i++) {
    const h = heights[i] || estimatedItemHeight;
    if (offset + h > scrollTop && startIndex === 0) {
      startIndex = Math.max(0, i - overscan);
    }
    if (offset > scrollTop + height && endIndex === items.length) {
      endIndex = Math.min(items.length, i + overscan);
      break;
    }
    offset += h;
  }

  return (
    <div
      ref={containerRef}
      style={{ height, overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: getTotalHeight(), position: 'relative' }}>
        {items.slice(startIndex, endIndex).map((item, index) => {
          const actualIndex = startIndex + index;
          const child = children(item, actualIndex);
          return React.cloneElement(child, {
            ref: (el: HTMLDivElement) => {
              itemRefs.current[actualIndex] = el;
            },
            style: {
              ...(child.props.style || {}),
              position: 'absolute',
              top: heights.slice(0, actualIndex).reduce((a, b) => a + b, 0),
              left: 0,
              right: 0,
            },
          });
        })}
      </div>
    </div>
  );
});
