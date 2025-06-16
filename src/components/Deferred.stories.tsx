import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Deferred } from "./Deferred";

const meta = {
  title: "Components/Deferred",
  component: Deferred,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A utility component for performance optimization. It defers rendering its children until a condition is met, such as a time delay or entering the viewport.

### Key Features
- **Time Delay:** Wait a specific number of milliseconds before rendering content.
- **Lazy Loading:** Render content only when the user scrolls it into view using an \`IntersectionObserver\`.
- **Combined Logic:** Can wait for an element to be in view and *then* apply an additional delay.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Deferred>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Helper Component for Examples ---
const ContentBox = ({ title, text }: { title: string; text: string }) => (
  <div className="bg-green-100 border border-green-300 text-green-800 p-6 rounded-lg shadow-md">
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p>{text}</p>
  </div>
);

// --- Story 1: Timed Delay ---
const TimedDelayExample = () => (
  <div className="p-8 flex flex-col items-center">
    <div className="w-full max-w-lg">
      <h3 className="text-xl font-bold mb-2">Timed Delay</h3>
      <p className="text-sm text-gray-600 mb-4">
        The content below will appear after a 2-second delay.
      </p>
      <Deferred
        delay={2000}
        placeholder={
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        }
      >
        <ContentBox
          title="Content Loaded!"
          text="This component was rendered after waiting 2000ms."
        />
      </Deferred>
    </div>
  </div>
);

// --- Story 2: When In View (Lazy Loading) ---
const WhenInViewExample = () => (
  <div className="p-8">
    <h3 className="text-xl font-bold mb-2 text-center">
      Lazy Loading on Scroll
    </h3>
    <p className="text-sm text-gray-600 mb-4 text-center">
      Scroll down to see the content appear as it enters the viewport.
    </p>
    <div className="h-screen text-center pt-16">Scroll Down... 👇</div>
    <div className="space-y-8">
      <Deferred
        whenInView
        placeholder={
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        }
      >
        <ContentBox
          title="Section 1 Loaded"
          text="This component rendered because you scrolled it into view."
        />
      </Deferred>
      <Deferred
        whenInView
        placeholder={
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        }
      >
        <ContentBox
          title="Section 2 Loaded"
          text="This is another deferred component that saves initial load time."
        />
      </Deferred>
      <Deferred
        whenInView
        placeholder={
          <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        }
      >
        <ContentBox
          title="Section 3 Loaded"
          text="This is great for images, ads, or heavy interactive components."
        />
      </Deferred>
    </div>
  </div>
);

// --- Story 3: Combined Delay and In-View ---
const CombinedExample = () => (
  <div className="p-8">
    <h3 className="text-xl font-bold mb-2 text-center">
      Combined: In View + Delay
    </h3>
    <p className="text-sm text-gray-600 mb-4 text-center">
      Scroll down. The content will appear 1 second *after* it enters the
      viewport.
    </p>
    <div className="h-screen text-center pt-16">Scroll Down... 👇</div>
    <Deferred
      whenInView
      delay={1000}
      placeholder={
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
      }
    >
      <ContentBox
        title="Content Loaded!"
        text="This component rendered 1000ms after it became visible."
      />
    </Deferred>
  </div>
);

export const WithDelay: Story = {
  name: "With a Time Delay",
  render: () => <TimedDelayExample />,
  args: {
    children: <div />,
  },
};

export const WhenInView: Story = {
  name: "When In View (Lazy Load)",
  render: () => <WhenInViewExample />,
  args: {
    children: <div />,
  },
};

export const Combined: Story = {
  name: "Combined: In View + Delay",
  render: () => <CombinedExample />,
  args: {
    children: <div />,
  },
};
