import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState, useCallback } from "react";
import { OnMount } from "../../src/components/OnMount";

const meta = {
  title: "Components/OnMount",
  component: OnMount,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A declarative utility component that executes a function once, immediately after the component mounts.

### Key Features
- **Declarative Side-Effects:** Provides a clean way to run mount-specific logic without cluttering your component's main body.
- **Simple and Predictable:** Runs only once, guaranteed.
- **Common Use Cases:** Fetching initial data, setting up third-party library instances, or logging analytics events.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnMount>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Interactive Example ---
const OnMountExample = () => {
  const [mountTime, setMountTime] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  // This function will be called by the OnMount component.
  // useCallback ensures it has a stable reference across renders.
  const handleMount = useCallback(() => {
    console.log("OnMount action triggered!");
    setMountTime(new Date().toLocaleTimeString());
  }, []);

  console.log(`Parent component rendered ${renderCount} time(s).`);

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center text-center">
      <h3 className="text-lg font-bold mb-2">OnMount Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        The time below is set only when the component first mounts. Re-rendering
        the parent does not change it.
      </p>

      <div className="w-full bg-gray-100 p-4 rounded-md mb-4">
        {mountTime ? (
          <p>
            Component Mounted At:{" "}
            <strong className="font-mono text-blue-600">{mountTime}</strong>
          </p>
        ) : (
          <p>Waiting for mount...</p>
        )}
      </div>

      <button
        onClick={() => setRenderCount((c) => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md w-full"
      >
        Force Parent Re-render ({renderCount})
      </button>

      {/* The OnMount component runs its action only once. */}
      <OnMount do={handleMount} />
    </div>
  );
};

export const Default: Story = {
  name: "Basic OnMount Example",
  render: () => <OnMountExample />,
  args: {
    do: () => {}, // Placeholder arg for Storybook
  },
};
