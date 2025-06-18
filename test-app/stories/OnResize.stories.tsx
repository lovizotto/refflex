import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { OnResize } from "../../src/components/OnResize";
import { useSignal, useSelector } from "../../src/hooks/useSignal";

const meta = {
  title: "Components/OnResize",
  component: OnResize,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A declarative utility component that runs a side-effect function whenever the browser window is resized.

### Key Features
- **Declarative Side-Effects:** Provides a clean way to react to window resize events without manual event listener management.
- **Initial Value:** Triggers once on mount to provide the initial window size.
- **Signal-Friendly:** Works perfectly for updating signals with the window's dimensions.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnResize>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Interactive Example ---
const OnResizeExample = () => {
  // A signal to hold the window dimensions.
  const size = useSignal({ width: 0, height: 0 });

  // Use useSelector to derive values for display.
  const width = useSelector(() => size.get().width);
  const height = useSelector(() => size.get().height);

  // This function will be called by the OnResize component.
  // Because it only calls a signal's setter, it has a stable reference
  // and does not need to be wrapped in `useCallback`.
  const handleResize = (newSize: { width: number; height: number }) => {
    size.set(newSize);
  };

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center text-center">
      <h3 className="text-lg font-bold mb-2">OnResize Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component uses OnResize to reactively track the window size. Try
        resizing your browser.
      </p>

      <div className="w-full bg-gray-100 p-4 rounded-md mb-4 font-mono">
        <p>
          Width: <strong className="text-blue-600">{width}px</strong>
        </p>
        <p>
          Height: <strong className="text-green-600">{height}px</strong>
        </p>
      </div>

      {/* The OnResize component calls our handler function on every resize. */}
      <OnResize on={handleResize} />
    </div>
  );
};

export const Default: Story = {
  name: "Basic OnResize Example",
  render: () => <OnResizeExample />,
  args: {
    on: () => {}, // Placeholder arg for Storybook
  },
};
