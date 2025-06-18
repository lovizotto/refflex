import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { Portal } from "../../src/components/Portal";

const meta = {
  title: "Components/Portal",
  component: Portal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A declarative component that renders its children into a different part of the DOM tree.
This is useful for creating UI elements like modals, tooltips, and notifications
that need to appear above the main application layout.

### Key Features
- **DOM Escape:** Renders content outside of its parent's DOM hierarchy.
- **Stacking Context:** Solves CSS \`z-index\` and \`overflow: hidden\` issues by teleporting content to a different DOM node (usually \`document.body\`).
- **Declarative:** Simply wrap the content you want to teleport.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Portal>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Interactive Example: A Modal Dialog ---
const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center text-center">
      <h3 className="text-lg font-bold mb-2">Portal Demo (Modal)</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button to open a modal. The modal's DOM node is attached
        directly to the document body, outside of this component's hierarchy.
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md w-full"
      >
        Open Modal
      </button>

      {/* When isOpen is true, the Portal and its children are mounted. */}
      {isOpen && (
        <Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h4 className="text-xl font-bold mb-4">Modal Title</h4>
              <p className="mb-6">
                This content is rendered in a portal. Check the DOM tree in your
                browser's dev tools!
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md w-full"
              >
                Close
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export const Default: Story = {
  name: "Modal Example",
  render: () => <ModalExample />,
  args: {
    children: <div />, // Placeholder arg for Storybook
  },
};
