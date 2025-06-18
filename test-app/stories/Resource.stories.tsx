import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Resource,
  ResourcePending,
  ResourceFulfilled,
  ResourceRejected,
} from "../../src/components/Resource";
import { useState, useCallback } from "react";

// Define a type for the user data for better type safety.
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
};

const meta = {
  title: "Components/Resource",
  component: Resource,
  parameters: {
    layout: "centered",
    // Component-level documentation. This will appear on the main Docs page.
    docs: {
      description: {
        component: `
The \`Resource\` component is a powerful utility for handling asynchronous operations declaratively.
It manages the entire lifecycle of a promise (\`pending\`, \`fulfilled\`, \`rejected\`)
and renders the appropriate UI for each state using a slot-based pattern.

### How to Use

Wrap your asynchronous logic in the \`Resource\` component and provide UI for each state.

\`\`\`tsx
import { Resource, ResourcePending, ResourceFulfilled, ResourceRejected } from './Resource';

// 1. Define an async function. IMPORTANT: Memoize it with useCallback.
const fetchUser = useCallback(async () => {
  const response = await fetch('https://api.example.com/user/1');
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}, []);

// 2. Use the Resource component to handle rendering.
<Resource<User> task={fetchUser}>
  <ResourcePending>
    <p>Loading user...</p>
  </ResourcePending>
  
  <ResourceFulfilled>
    {(user) => (
      <div>
        <h2>Welcome, {user.name}</h2>
      </div>
    )}
  </ResourceFulfilled>
  
  <ResourceRejected>
    {(error) => (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    )}
  </ResourceRejected>
</Resource>
\`\`\`
`,
      },
    },
  },
  // This tag enables the auto-generated documentation page.
  tags: ["autodocs"],
} satisfies Meta<typeof Resource>;

export default meta;
type Story = StoryObj<typeof meta>;

// An example component demonstrating the 'fulfilled' state of the Resource.
const UserResourceExample = () => {
  // A key is used to force a remount of the Resource component, thus re-triggering the fetch.
  const [key, setKey] = useState(0);

  // The async task to fetch user data.
  // It's wrapped in useCallback to ensure it has a stable reference across re-renders,
  // preventing the useEffect in <Resource> from causing an infinite loop.
  const fetchUser = useCallback(async (): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
      id: 1,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Administrator",
      lastLogin: new Date().toLocaleString(),
    };
  }, []); // Empty dependency array means the function is created only once.

  // Function to trigger a reload by changing the key.
  const reload = () => setKey((prev) => prev + 1);

  // @ts-ignore
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        minWidth: "300px",
      }}
    >
      <button onClick={reload}>Reload User</button>
      <div style={{ marginTop: "10px" }}>
        <Resource<User>
          key={key}
          task={fetchUser}
        >
          <ResourcePending>
            <p>Loading user profile...</p>
          </ResourcePending>
          <ResourceFulfilled>
            {(user: { id: number; name: string; lastLogin: string }) => (
              <div>
                <h4>User Profile</h4>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Last Login:</strong> {user.lastLogin}
                </p>
              </div>
            )}
          </ResourceFulfilled>
          <ResourceRejected>
            {(error) => <p>Error: {error.message}</p>}
          </ResourceRejected>
        </Resource>
      </div>
    </div>
  );
};

// An example component demonstrating the 'rejected' state of the Resource.
const ProductResourceErrorExample = () => {
  const [key, setKey] = useState(0);

  // An async task that is designed to fail.
  // Also wrapped in useCallback for stability.
  const fetchProduct = useCallback(async () => {
    // Simulate a failing API call
    await new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Product not found or server error")),
        1500,
      ),
    );
    // This return is just for type consistency; it's unreachable.
    return null;
  }, []);

  const retry = () => setKey((prev) => prev + 1);

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        minWidth: "300px",
      }}
    >
      <button onClick={retry}>Retry Fetch</button>
      <div style={{ marginTop: "10px" }}>
        <Resource
          key={key}
          task={fetchProduct}
        >
          <ResourcePending>
            <p>Fetching product details...</p>
          </ResourcePending>
          <ResourceFulfilled>
            {() => <p>This will never be shown.</p>}
          </ResourceFulfilled>
          <ResourceRejected>
            {(error) => (
              <div style={{ color: "red" }}>
                <h4>Error Loading Product</h4>
                <p>{error?.message || "Unknown error"}</p>
              </div>
            )}
          </ResourceRejected>
        </Resource>
      </div>
    </div>
  );
};

/**
 * This story demonstrates the successful data fetching flow.
 * It shows the pending state first, then transitions to the fulfilled state.
 */
export const SuccessState: Story = {
  name: "✅ Success Flow",
  render: () => <UserResourceExample />,
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how to fetch user data and display it once loaded.",
      },
    },
  },
  //@ts-ignore
  args: {},
};

/**
 * This story demonstrates the error handling flow.
 * It shows the pending state and then transitions to the rejected state.
 */
export const ErrorState: Story = {
  name: "❌ Error Flow",
  render: () => <ProductResourceErrorExample />,
  //@ts-ignore
  args: {},
};
