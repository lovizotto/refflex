//@ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useRef } from "react";

import { useSignal, useSelector } from "../hooks/useSignal";
import { createEffect } from "../core/signals";
import { VirtualList } from "./VirtualList";
import { S } from "./S";

const meta = {
  title: "Components/VirtualList",
  component: VirtualList,
  parameters: {
    layout: "fullscreen", // Use fullscreen for better viewing
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VirtualList>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Define the shape of our list items for type safety ---
type Item = {
  id: number;
  title: string;
  height: number;
  color: string;
};

// --- Helper to generate data ---
const generateItems = (count: number, offset = 0): Item[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = i + offset;
    return {
      id,
      title: `Item ${id}`,
      // Give items variable heights for a more realistic scenario
      height: 32 + Math.floor(Math.random() * 60),
      color: `hsl(${(id * 30) % 360}, 70%, 90%)`,
    };
  });
};

// --- Interactive Showcase Example ---
const InteractiveShowcase = () => {
  const listRef = useRef<any>(null);
  const itemCount = useSignal(9_999); // Start with a large number of items
  const items = useSignal(generateItems(itemCount.peek()));

  // A side-effect that re-generates the list when itemCount changes
  createEffect(() => {
    items.set(generateItems(itemCount.get()));
  });

  const handleScrollTo = (target: "top" | "middle" | "bottom" | "random") => {
    if (!listRef.current) return;
    const count = itemCount.peek();
    let index = 0;
    switch (target) {
      case "top":
        index = 0;
        break;
      case "middle":
        index = Math.floor(count / 2);
        break;
      case "bottom":
        index = count - 1;
        break;
      case "random":
        index = Math.floor(Math.random() * count);
        break;
    }
    listRef.current.scrollToIndex(index, { align: "center" });
  };

  const addItems = (position: "top" | "bottom") => {
    const currentItems = items.peek();
    const newItems = generateItems(
      10,
      position === "top"
        ? (currentItems[0]?.id || 0) - 10
        : currentItems.length,
    );
    items.set(
      position === "top"
        ? [...newItems, ...currentItems]
        : [...currentItems, ...newItems],
    );
    itemCount.set(items.peek().length);
  };

  return (
    <div className="p-4 w-full h-screen flex flex-col items-center bg-gray-50 font-sans">
      <div className="w-full max-w-2xl flex flex-col h-full">
        <header className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800">
            VirtualList Interactive Showcase
          </h3>
          <p className="text-sm text-gray-600">
            This list virtually renders{" "}
            <strong className="text-blue-600 font-semibold">
              <S>{itemCount}</S>
            </strong>{" "}
            items with variable heights.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => handleScrollTo("top")}
            className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300"
          >
            Scroll to Top
          </button>
          <button
            onClick={() => handleScrollTo("middle")}
            className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300"
          >
            Scroll to Middle
          </button>
          <button
            onClick={() => handleScrollTo("random")}
            className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300"
          >
            Scroll to Random
          </button>
          <button
            onClick={() => handleScrollTo("bottom")}
            className="p-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300"
          >
            Scroll to Bottom
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => addItems("top")}
            className="p-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600"
          >
            Add 10 to Top
          </button>
          <button
            onClick={() => addItems("bottom")}
            className="p-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600"
          >
            Add 10 to Bottom
          </button>
        </div>

        <div className="border border-gray-300 rounded-lg shadow-inner bg-white">
          <VirtualList
            ref={listRef}
            items={items}
            height={500}
            estimatedItemHeight={50}
          >
            {(item, index) => (
              <div
                className="p-3 border-b border-gray-200 flex items-center"
                style={{ height: item.height, backgroundColor: item.color }}
              >
                <span className="font-mono text-xs text-gray-500 w-20">
                  # {item.id}
                </span>
                <span className="font-bold text-sm text-gray-800">
                  {item.title}
                </span>
              </div>
            )}
          </VirtualList>
        </div>
        <footer className="text-center text-xs text-gray-500 pt-2">
          The browser only renders the visible items, preventing crashes even
          with millions of rows.
        </footer>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  name: "Interactive Showcase",
  render: () => <InteractiveShowcase />,
  args: {
    // By providing correctly typed placeholders for all props, including `children`,
    // we guide TypeScript's inference for the generic component `VirtualList<T>`.
    items: [] as Item[],
    height: 500,
    children: (item: Item) => <div>{item.title}</div>,
  },
};
