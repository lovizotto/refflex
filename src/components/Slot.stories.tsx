import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ProvideSlots, Slot } from "../components/Slot";

const meta = {
  title: "Components/Slot",
  component: Slot,
  subcomponents: { ProvideSlots }, // Include ProvideSlots in the documentation
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Slot component system provides a powerful way to create flexible and composable layout components.

### How It Works
1.  **Layout Component:** Create a reusable layout component (e.g., \`Card\`, \`Modal\`) that uses the \`<Slot />\` component to define named placeholders for content (e.g., \`header\`, \`footer\`).
2.  **Provide Content:** When using the layout component, wrap it in a \`<ProvideSlots />\` component.
3.  **Slots Prop:** Pass a \`slots\` object to \`<ProvideSlots>\`. The keys of the object should match the names of the slots you want to fill, and the values should be the React nodes you want to render.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- A Reusable Layout Component Using Slots ---
const Card = ({ children }: { children?: React.ReactNode }) => (
  <div className="w-96 rounded-lg border bg-white shadow-sm">
    <div className="p-4 border-b">
      <Slot name="header">
        {/* This is the default content for the 'header' slot */}
        <h3 className="font-bold text-lg">Default Header</h3>
      </Slot>
    </div>
    <div className="p-4">
      <Slot name="body">
        {/* Default body content */}
        <p className="text-gray-600">
          This is the default body content. You can override it.
        </p>
      </Slot>
    </div>
    <div className="p-4 border-t bg-gray-50 text-xs text-gray-500">
      <Slot name="footer">
        {/* Default footer content */}
        <p>Default Footer</p>
      </Slot>
    </div>
  </div>
);

// --- Story 1: Using the Default Slots ---
const DefaultSlotExample = () => (
  <div className="p-5 flex flex-col items-center">
    <h3 className="text-xl font-bold mb-4">Card with Default Slots</h3>
    <Card />
  </div>
);

// --- Story 2: Providing Custom Content to Slots ---
const CustomSlotExample = () => {
  const customSlots = {
    header: (
      <h3 className="text-xl font-bold text-blue-600">🚀 Custom Header</h3>
    ),
    body: (
      <div className="space-y-2">
        <p>
          This entire block of JSX is passed into the 'body' slot of the Card
          component.
        </p>
        <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
          Click Me
        </button>
      </div>
    ),
    footer: (
      <div className="flex justify-between items-center">
        <span>Custom Footer</span>
        <span className="font-mono text-green-600">Status: OK</span>
      </div>
    ),
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4">Card with Custom Slots</h3>
      <ProvideSlots slots={customSlots}>
        <Card />
      </ProvideSlots>
    </div>
  );
};

export const DefaultSlots: Story = {
  name: "Using Default Slots",
  render: () => <DefaultSlotExample />,
  args: {
    name: "header",
    children: <div />,
  },
};

export const CustomSlots: Story = {
  name: "Providing Custom Slots",
  render: () => <CustomSlotExample />,
  args: {
    name: "header",
    children: <div />,
  },
};
