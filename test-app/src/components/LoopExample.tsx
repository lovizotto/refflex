import React from "react";
import { useSignal } from "../../hooks/useSignal";
import { Loop } from "../../../src/components/Loop";

const LoopExample = () => {
  const items = useSignal([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ]);

  const addItem = () => {
    const currentItems = items.peek();
    const newId =
      currentItems.length > 0
        ? Math.max(...currentItems.map((item) => item.id)) + 1
        : 1;
    items.set([...currentItems, { id: newId, name: `Item ${newId}` }]);
  };

  const removeItem = (idToRemove: number) => {
    items.set(items.peek().filter((item) => item.id !== idToRemove));
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={addItem}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3 self-start"
      >
        Add Item
      </button>
      <div className="space-y-2">
        <Loop each={items}>
          {(item) => (
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{item.name}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </Loop>
      </div>
    </div>
  );
};

export default LoopExample;
