import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { FormEvent, useState } from "react";
import { ViewState, State } from "refflex";
import { useSignal, useSelector, useComputed } from "../../src/hooks/useSignal";
import { S } from "refflex";
import { BindInput } from "refflex";

const meta = {
  title: "Components/ViewState",
  component: ViewState,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The ViewState component provides a declarative way to render different UI based on a state value.
It's optimized to react to signals, preventing parent re-renders, but is also fully compatible with standard React state.

### Key Features
- **Declarative:** Replaces complex ternary operators or \`if/else\` blocks in your JSX.
- **State-Driven:** Cleanly maps a state value (e.g., 'loading', 'success', 'error') to a specific UI.
- **Signal-Optimized:** When passed a signal, only the \`ViewState\` component re-renders on change, not its parent.

### Basic Usage
\`\`\`tsx
import { ViewState, State } from './ViewState';
import { useSignal } from '../hooks/useSignal';

const MyComponent = () => {
  const currentView = useSignal('profile'); // 'profile' | 'settings'

  return (
    <ViewState state={currentView}>
      <State name="profile">
        <ProfilePage />
      </State>
      <State name="settings">
        <SettingsPage />
      </State>
    </ViewState>
  );
};
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ViewState>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Basic Example ---
const BasicExample = () => {
  const view = useSignal("welcome");

  const NavButton = ({ name }: { name: string }) => {
    const isActive = useSelector(() => view.get() === name);
    return (
      <button
        onClick={() => view.set(name)}
        className={`px-4 py-2 rounded-md font-semibold transition-colors ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
      >
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </button>
    );
  };

  return (
    <div className="p-5 border rounded-lg w-[500px]">
      <h3 className="text-xl font-bold mb-2">Basic ViewState</h3>
      <p className="text-sm text-gray-600 mb-4">
        Current state:{" "}
        <strong className="font-mono">
          <S>{view}</S>
        </strong>
      </p>

      <div className="flex gap-2 mb-5">
        <NavButton name="welcome" />
        <NavButton name="about" />
        <NavButton name="contact" />
      </div>

      <div className="p-5 bg-gray-50 rounded-lg min-h-[150px]">
        <ViewState state={view}>
          <State name="welcome">
            <h4 className="font-bold text-lg">Welcome!</h4>
            <p>This is the welcome screen. Click the buttons to navigate.</p>
          </State>
          <State name="about">
            <h4 className="font-bold text-lg">About Us</h4>
            <p>
              This screen demonstrates how ViewState shows different content.
            </p>
          </State>
          <State name="contact">
            <h4 className="font-bold text-lg">Contact Us</h4>
            <p>
              Use ViewState for multi-state UIs without complex conditional
              rendering.
            </p>
          </State>
        </ViewState>
      </div>
    </div>
  );
};

// --- Multi-Step Form Example ---
const MultiStepFormExample = () => {
  const formStep = useSignal("personal");
  const formData = useSignal({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });

  const StepIndicator = ({ name, step }: { name: string; step: number }) => {
    const currentStepIndex = useSelector(() =>
      ["personal", "address", "confirmation"].indexOf(formStep.get()),
    );
    const isActive = currentStepIndex === step;
    const isCompleted = currentStepIndex > step;
    return (
      <div
        className={`flex-1 p-2 text-center text-sm font-semibold rounded-md transition-colors
            ${isActive ? "bg-blue-500 text-white" : ""}
            ${isCompleted ? "bg-green-500 text-white" : ""}
            ${!isActive && !isCompleted ? "bg-gray-200" : ""}
        `}
      >
        {name}
      </div>
    );
  };

  return (
    <div className="p-5 border rounded-lg w-[500px]">
      <h3 className="text-xl font-bold mb-4">Multi-Step Form</h3>

      <div className="flex gap-2 mb-5">
        <StepIndicator
          name="Personal"
          step={0}
        />
        <StepIndicator
          name="Address"
          step={1}
        />
        <StepIndicator
          name="Confirm"
          step={2}
        />
      </div>

      <div className="p-5 bg-gray-50 rounded-lg min-h-[250px]">
        <ViewState
          state={formStep}
          fallback={<div>Invalid Step</div>}
        >
          <State name="personal">
            <h4 className="font-bold mb-3">Personal Information</h4>
            <div className="space-y-3">
              {/*<BindInput*/}
              {/*  signal={useComputed(() => formData.get().firstName)}*/}
              {/*  onChange={(e: string) =>*/}
              {/*    formData.set({*/}
              {/*      ...formData.peek(),*/}
              {/*      firstName: e,*/}
              {/*    })*/}
              {/*  }*/}
              {/*  placeholder="First Name"*/}
              {/*  className="p-2 border rounded w-full"*/}
              {/*/>*/}
              {/*<BindInput*/}
              {/*  signal={useComputed(() => formData.get().lastName)}*/}
              {/*  onChange={(e) =>*/}
              {/*    formData.set({ ...formData.peek(), lastName: e.target.value })*/}
              {/*  }*/}
              {/*  placeholder="Last Name"*/}
              {/*  className="p-2 border rounded w-full"*/}
              {/*/>*/}
            </div>
            <button
              onClick={() => formStep.set("address")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </State>

          <State name="address">
            <h4 className="font-bold mb-3">Address</h4>
            <div className="space-y-3">
              {/*<BindInput*/}
              {/*  signal={useComputed(() => formData.get().address)}*/}
              {/*  onChange={(e) =>*/}
              {/*    formData.set({ ...formData.peek(), address: e.target.value })*/}
              {/*  }*/}
              {/*  placeholder="Street Address"*/}
              {/*  className="p-2 border rounded w-full"*/}
              {/*/>*/}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => formStep.set("personal")}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={() => formStep.set("confirmation")}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            </div>
          </State>

          <State name="confirmation">
            <h4 className="font-bold mb-3">Confirmation</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Name:</strong>{" "}
                <S>
                  {useComputed(
                    () =>
                      `${formData.get().firstName} ${formData.get().lastName}`,
                  )}
                </S>
              </p>
              <p>
                <strong>Address:</strong>{" "}
                <S>{useComputed(() => formData.get().address)}</S>
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => formStep.set("address")}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <button
                onClick={() => alert("Form Submitted!")}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </State>
        </ViewState>
      </div>
    </div>
  );
};

export const Basic: Story = {
  name: "Basic State Switching",
  render: () => <BasicExample />,
  args: { state: "welcome", children: null },
};

export const MultiStepForm: Story = {
  name: "Multi-Step Form with Signals",
  render: () => <MultiStepFormExample />,
  args: { state: "personal", children: null },
};
