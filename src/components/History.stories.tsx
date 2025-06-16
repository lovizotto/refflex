import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { useSelector, useComputed } from "../hooks/useSignal";
import { ViewState, State } from "./ViewState";
import { S } from "./S";
import { Cond, When, Otherwise } from "./Cond";
import { createParams, locationSignal, navigate } from "./History";
import { OnMount } from "./OnMount";

const meta = {
  title: "Routing/History API",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
This is not a single component, but a collection of utilities for building signal-based routing.
The core of the system is the \`locationSignal\`, which reactively holds the current URL state.

### Key Utilities

- **\`locationSignal\`**: A signal containing the parsed URL (\`pathname\`, \`search\`, \`hash\`, and pre-parsed \`params\`). Use it with \`useSelector\` to react to URL changes.
- **\`navigate(to)\`**: Programmatically pushes a new URL to the browser history.
- **\`replace(to)\`**: Programmatically replaces the current URL in the browser history.
- **\`createParams(pattern)\`**: Creates a computed signal that extracts named parameters from a URL pattern (e.g., \`/users/:id\`).

### Example
\`\`\`tsx
import { locationSignal, navigate, createParams } from './history';
import { useSelector } from './hooks/useSignal';

const userIdParams = createParams('/users/:id');

function UserPage() {
  const pathname = useSelector(() => locationSignal.get().pathname);
  const userId = useSelector(() => userIdParams.get().id);
  const sortOrder = useSelector(() => locationSignal.get().params.get('sort'));

  if (!userId) return <p>Please select a user.</p>;

  return (
    <div>
      <p>Current Path: {pathname}</p>
      <p>Showing profile for User ID: {userId}</p>
      <p>Sort order: {sortOrder || 'default'}</p>
    </div>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

// --- Helper Components for Stories ---
const NavButton = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  // This button is reactive and knows if it's the active link.
  const isActive = useSelector(() => locationSignal.get().pathname === to);
  return (
    <button
      onClick={() => navigate(to)}
      className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm
        ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
    >
      {children}
    </button>
  );
};

// --- Story 1: Basic Declarative Router ---
const BasicRouter = () => {
  // The 'page' is derived reactively from the global location signal.
  const page = useSelector(() => locationSignal.get().pathname);

  return (
    <div className="p-5 border rounded-lg w-[500px]">
      <h3 className="text-xl font-bold mb-2">Declarative Router</h3>
      <p className="text-sm text-gray-600 mb-4">
        Current Path: <strong className="font-mono">{page}</strong>
      </p>
      <div className="flex gap-2 mb-5">
        <NavButton to="/home">Home</NavButton>
        <NavButton to="/dashboard">Dashboard</NavButton>
        <NavButton to="/settings">Settings</NavButton>
      </div>
      <div className="p-5 bg-gray-50 rounded-lg min-h-[150px]">
        {/* ViewState declaratively switches views based on the reactive 'page' value. */}
        <ViewState state={page}>
          <State name="/home">
            <h4 className="font-bold text-lg">Home Page</h4>
          </State>
          <State name="/dashboard">
            <h4 className="font-bold text-lg">Dashboard Analytics</h4>
          </State>
          <State name="/settings">
            <h4 className="font-bold text-lg">User Settings</h4>
          </State>
        </ViewState>
      </div>
      <OnMount do={() => navigate("/home")} />
    </div>
  );
};

// --- Story 2: Path and Query Params ---

// Create a params signal once. It will react to URL changes.
const userParams = createParams("/users/:userId");

const ParamsExample = () => {
  // Create computed signals for values we want to display with <S>
  const pathnameSignal = useComputed(() => locationSignal.get().pathname);
  const userIdSignal = useComputed(() => userParams.get().userId);
  const sortSignal = useComputed(() => locationSignal.get().params.get("sort"));
  const showBioSignal = useComputed(
    () => locationSignal.get().params.get("bio") === "true",
  );
  const showBioTextSignal = useComputed(() => showBioSignal.get().toString());

  // Use useSelector for values needed in component logic (like conditions)
  const hasUserId = useSelector(() => !!userParams.get().userId);

  React.useEffect(() => {
    navigate("/users/123?sort=asc");
  }, []);

  return (
    <div className="p-5 border rounded-lg w-[500px]">
      <h3 className="text-xl font-bold mb-2">Path & Query Params</h3>
      <div className="flex gap-2 mb-4">
        <NavButton to="/users/123?sort=asc">User 123</NavButton>
        <NavButton to="/users/456?bio=true">User 456</NavButton>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm space-y-2">
        <p>
          Pathname: <S>{pathnameSignal}</S>
        </p>
        <div>
          <h4 className="font-sans font-bold text-gray-700">Path Params:</h4>
          <Cond>
            <When is={hasUserId}>
              <p className="pl-4">
                userId:{" "}
                <strong className="text-green-600">
                  <S>{userIdSignal}</S>
                </strong>
              </p>
            </When>
            <Otherwise>
              <p className="pl-4 text-gray-500 italic">No user ID in path.</p>
            </Otherwise>
          </Cond>
        </div>
        <div>
          <h4 className="font-sans font-bold text-gray-700">Query Params:</h4>
          <p className="pl-4">
            sort:{" "}
            <strong className="text-green-600">
              <S>{sortSignal}</S>
            </strong>
          </p>
          <p className="pl-4">
            bio:{" "}
            <strong className="text-green-600">
              <S>{showBioTextSignal}</S>
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export const DeclarativeRouter: StoryObj = {
  name: "Declarative Router",
  render: () => <BasicRouter />,
};

export const Parameters: StoryObj = {
  name: "Path & Query Parameters",
  render: () => <ParamsExample />,
};
