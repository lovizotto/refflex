import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { AnimatePresence } from "refflex";
import { useSignal } from "../../src/hooks/useSignal";
import { S } from "refflex";

const meta = {
  title: "Components/AnimatePresence",
  component: AnimatePresence,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A component that provides a fade animation when conditionally rendering content.
It's optimized for signals but also works with standard React state.

### Key Features
- **Graceful Animations:** Keeps children in the DOM during their exit animation, preventing them from disappearing abruptly.
- **Signal-Optimized:** When the \`show\` prop is a signal, the parent component will not re-render on toggle.
- **Backward Compatible:** Works seamlessly with plain boolean props from \`useState\`.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatePresence>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Example Content ---
const AnimatedBox = () => (
  <div className="w-48 h-48 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
    Hello!
  </div>
);

// --- Story 1: Signal Control (Optimized) ---
const SignalExample = () => {
  const isVisible = useSignal(true);
  console.log("Rendering SignalExample parent..."); // This will log only once.

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Signal Control (Optimized)</h3>
      <p className="text-xs text-gray-500 mb-4">
        Parent does not re-render. Check the console.
      </p>
      <button
        onClick={() => isVisible.set(!isVisible.peek())}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4 w-full"
      >
        Toggle Visibility
      </button>
      <AnimatePresence show={isVisible}>
        <AnimatedBox />
      </AnimatePresence>
    </div>
  );
};

// --- Story 2: useState Control (Compatible) ---
const StateExample = () => {
  const [isVisible, setIsVisible] = useState(true);
  console.log("Rendering StateExample parent..."); // This will log on every toggle.

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">useState Control (Compatible)</h3>
      <p className="text-xs text-gray-500 mb-4">
        Parent re-renders on toggle, which is normal.
      </p>
      <button
        onClick={() => setIsVisible((v) => !v)}
        className="px-4 py-2 bg-orange-500 text-white rounded-md mb-4 w-full"
      >
        Toggle Visibility
      </button>
      <AnimatePresence show={isVisible}>
        <AnimatedBox />
      </AnimatePresence>
    </div>
  );
};

export const WithSignal: Story = {
  name: "With Signal (Optimized)",
  render: () => <SignalExample />,
  args: {
    show: true,
    children: <div />,
  },
};

export const WithState: Story = {
  name: "With useState (Compatible)",
  render: () => <StateExample />,
  args: {
    show: true,
    children: <div />,
  },
};
