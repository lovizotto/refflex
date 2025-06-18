import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { BindInput } from "refflex";
import { useSignal } from "../../src/hooks/useSignal";
import { S } from "refflex";

const meta = {
  title: "Components/BindInput",
  component: BindInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A two-way data binding component for form inputs. It's optimized for signals but also works as a standard controlled component with \`useState\`.

### Key Features
- **Two-Way Binding:** Simplifies form state management.
- **Signal-Optimized:** When the \`signal\` prop is used, the parent component does not re-render on input changes.
- **Backward Compatible:** Works seamlessly with the standard \`value\` and \`onChange\` props from \`useState\`.
- **Type-Safe:** Handles both \`string\` and \`number\` types automatically.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BindInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Story 1: Signal Control (Optimized) ---
const SignalExample = () => {
  const text = useSignal("");
  const number = useSignal(0);
  console.log("Rendering SignalExample parent..."); // This will log only once.

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Signal Control (Optimized)</h3>
      <p className="text-xs text-gray-500 mb-4">
        Parent does not re-render. Check the console.
      </p>

      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Text Input</label>
          <BindInput
            signal={text}
            className="p-2 border rounded w-full"
            placeholder="Type something..."
          />
          <p className="mt-1 text-sm">
            Value:{" "}
            <strong className="font-mono">
              <S>{text}</S>
            </strong>
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Number Input
          </label>
          <BindInput
            signal={number}
            type="number"
            className="p-2 border rounded w-full"
          />
          <p className="mt-1 text-sm">
            Value:{" "}
            <strong className="font-mono">
              <S>{number}</S>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Story 2: useState Control (Compatible) ---
const StateExample = () => {
  const [text, setText] = useState("");
  const [number, setNumber] = useState(0);
  console.log("Rendering StateExample parent..."); // This will log on every input change.

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">useState Control (Compatible)</h3>
      <p className="text-xs text-gray-500 mb-4">
        Parent re-renders on input change, which is normal.
      </p>
      <div className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Text Input</label>
          <BindInput
            value={text}
            onChange={setText}
            className="p-2 border rounded w-full"
            placeholder="Type something..."
          />
          <p className="mt-1 text-sm">
            Value: <strong className="font-mono">{text}</strong>
          </p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Number Input
          </label>
          <BindInput
            value={number}
            onChange={(val) => setNumber(val)}
            type="number"
            className="p-2 border rounded w-full"
          />
          <p className="mt-1 text-sm">
            Value: <strong className="font-mono">{number}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export const WithSignal: Story = {
  name: "With Signal (Optimized)",
  render: () => <SignalExample />,
  args: {
    signal: {
      get: () => "",
      set: () => {},
      peek: () => "",
      subscribe: () => () => {},
    },
  },
};

export const WithState: Story = {
  name: "With useState (Compatible)",
  render: () => <StateExample />,
  args: {
    value: "",
    onChange: () => {},
  },
};
