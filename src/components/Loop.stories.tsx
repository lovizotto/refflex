import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Loop } from "../components/Loop";
import { useSignal } from "../hooks/useSignal";
import { S } from "../components/S";

const meta = {
  title: "Components/Loop",
  component: Loop,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Loop component provides a declarative and performant way to render lists.
It is optimized to be reactive when passed a signal, ensuring that only the list re-renders on data changes, not the parent component.

### Key Features
- **Declarative API:** Simply pass an array or a signal to the \`each\` prop and provide a render function as children.
- **Signal-Optimized:** When used with a signal, it creates a highly efficient, fine-grained subscription to the list data.
- **Backward Compatible:** Works seamlessly with plain JavaScript arrays. The component will re-render only when the parent provides a new array reference, following standard React behavior.
- **Automatic Keys:** It automatically handles keys by looking for an \`id\` property on items or falling back to the index.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Loop>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Story 1: Static List ---
const StaticListExample = () => {
  const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  return (
    <div className="p-5 border rounded-lg w-80">
      <h3 className="text-lg font-bold mb-2">Static List</h3>
      <p className="text-sm text-gray-600 mb-4">
        This example uses a plain, static array. The list renders once.
      </p>
      <ul className="list-disc list-inside">
        <Loop each={fruits}>{(fruit) => <li>{fruit}</li>}</Loop>
      </ul>
    </div>
  );
};

// --- Story 2: Reactive List with Signals ---
const ReactiveListExample = () => {
  const items = useSignal([
    { id: 1, text: "First Item" },
    { id: 2, text: "Second Item" },
  ]);

  const addItem = () => {
    const currentItems = items.peek();
    const newId =
      currentItems.length > 0
        ? Math.max(...currentItems.map((item) => item.id)) + 1
        : 1;
    items.set([...currentItems, { id: newId, text: `Item #${newId}` }]);
  };

  const removeLastItem = () => {
    items.set(items.peek().slice(0, -1));
  };

  // This parent component does not re-render when the list changes.
  console.log("Rendering ReactiveListExample parent...");

  return (
    <div className="p-5 border rounded-lg w-96">
      <h3 className="text-lg font-bold mb-2">Reactive List (with Signals)</h3>
      <p className="text-sm text-gray-600 mb-4">
        Only the list below re-renders, not this parent component.
      </p>
      <div className="flex gap-2 mb-4">
        <button
          onClick={addItem}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Item
        </button>
        <button
          onClick={removeLastItem}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Remove Last
        </button>
      </div>
      <ul className="space-y-2">
        <Loop each={items}>
          {(item) => (
            <li className="p-2 bg-gray-50 rounded flex justify-between items-center">
              <span>{item.text}</span>
              <span className="text-xs font-mono text-gray-400">
                ID: {item.id}
              </span>
            </li>
          )}
        </Loop>
      </ul>
    </div>
  );
};

export const Static: Story = {
  name: "With a Static Array",
  render: () => <StaticListExample />,
  args: {
    each: [],
    children: () => <div />,
  },
};

export const Reactive: Story = {
  name: "With a Reactive Signal",
  render: () => <ReactiveListExample />,
  args: {
    each: [],
    children: () => <div />,
  },
};
