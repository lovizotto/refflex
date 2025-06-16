import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TransitionZone } from "../components/TransitionZone";
import { useSignal, useSelector } from "../hooks/useSignal";
import { Loop } from "../components/Loop";
import { S } from "../components/S";
import { BindInput } from "../components/BindInput";

const meta = {
  title: "Components/TransitionZone",
  component: TransitionZone,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A performance utility that wraps state updates in a React Transition.
This keeps the UI responsive during slow or complex re-renders.

### When to Use
Use this component to wrap parts of your UI that update based on state but are slow to render, such as a large data grid that is being filtered. By marking the update as a transition, you prevent a laggy user experience in other parts of the UI (e.g., a search input).
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TransitionZone>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Helper Components for the Demo ---

// A "heavy" component that simulates a slow render.
const HeavyListItem = ({ text }: { text: string }) => {
  // This is a contrived way to make a component "slow".
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1ms to simulate a slow render
  }
  return <div className="p-2 border-b border-gray-200">{text}</div>;
};

// A list of 300 items to filter.
const allItems = Array.from({ length: 300 }, (_, i) => `Item ${i}`);

// --- Interactive Showcase ---
const InteractiveExample = () => {
  const searchTerm = useSignal("");

  // A computed signal that filters the large list. This can be a slow operation.
  const filteredItems = useSelector(() => {
    const term = searchTerm.get().toLowerCase();
    if (!term) return allItems;
    return allItems.filter((item) => item.toLowerCase().includes(term));
  });

  return (
    <div className="p-8 w-full h-screen grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50">
      {/* --- Example WITHOUT TransitionZone --- */}
      <div className="flex flex-col p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-2">
          Without TransitionZone (Laggy)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Typing in this input will feel slow and janky because the UI must wait
          for the entire list to re-render on every keystroke.
        </p>
        <BindInput
          signal={searchTerm}
          placeholder="Type to filter..."
          className="p-2 border rounded-md mb-4"
        />
        <div className="border rounded-md h-full overflow-auto">
          <Loop each={filteredItems}>
            {(item) => <HeavyListItem text={item} />}
          </Loop>
        </div>
      </div>

      {/* --- Example WITH TransitionZone --- */}
      <div className="flex flex-col p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-2">
          With TransitionZone (Responsive)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Typing here feels fast. The input remains responsive while the list
          updates in the background, marked as a non-urgent transition.
        </p>
        <BindInput
          signal={searchTerm}
          placeholder="Type to filter..."
          className="p-2 border rounded-md mb-4"
        />
        <div className="border rounded-md h-full overflow-auto">
          <TransitionZone>
            <Loop each={filteredItems}>
              {(item) => <HeavyListItem text={item} />}
            </Loop>
          </TransitionZone>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  name: "Interactive Showcase",
  render: () => <InteractiveExample />,
  args: {
    children: <div />, // Placeholder arg for Storybook
  },
};
