// components/_PushNotification.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useState } from "react";
import { PushNotification } from "./PushNotification";

// --- Step 1: Create a more robust, interactive mock ---
// This mock allows us to store the event listener and trigger it manually.
const createMockServiceWorker = () => {
  let messageHandler: ((event: MessageEvent) => void) | null = null;

  return {
    addEventListener: (event: string, handler: EventListener) => {
      if (event === "message") {
        console.log(
          'Storybook Mock: Service worker "message" listener attached.',
        );
        messageHandler = handler as (event: MessageEvent) => void;
      }
    },
    removeEventListener: (event: string, handler: EventListener) => {
      if (event === "message" && messageHandler === handler) {
        console.log(
          'Storybook Mock: Service worker "message" listener removed.',
        );
        messageHandler = null;
      }
    },
    // The `ready` promise is part of the real API.
    ready: Promise.resolve(),
    // This is a custom method for our mock to simulate a push event.
    simulatePushMessage: (data: any) => {
      if (messageHandler) {
        console.log("Storybook Mock: Simulating push message:", data);
        // The component expects the data wrapped in a specific format.
        const mockEvent = new MessageEvent("message", {
          data: {
            type: "push-message", // Match the type expected by the component.
            data: data,
          },
        });
        messageHandler(mockEvent);
      } else {
        console.warn(
          "Storybook Mock: simulatePushMessage called, but no listener is attached.",
        );
      }
    },
  };
};

// --- Step 2: Set up mocks for browser APIs before stories run ---
// It's better to do this once at the module level.
(window as any).Notification = class MockNotification {
  static permission: NotificationPermission = "default";
  static requestPermission = async (): Promise<NotificationPermission> => {
    // Simulate a user taking a moment to decide.
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate the user clicking "Allow".
        const newPermission = "granted";
        MockNotification.permission = newPermission;
        resolve(newPermission);
      }, 800);
    });
  };
};

const mockServiceWorker = createMockServiceWorker();
Object.defineProperty(navigator, "serviceWorker", {
  value: mockServiceWorker,
  configurable: true,
});

// --- Storybook Metadata ---
const meta = {
  title: "Components/PushNotification",
  component: PushNotification,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PushNotification>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Basic Example Story ---
const BasicPushNotificationExample = () => {
  // Step 3: Manage state inside the component with `useState`.
  const [status, setStatus] = useState<string>("Waiting for permission...");
  const [messages, setMessages] = useState<string[]>([]);

  // Use useCallback to memoize the function, though not strictly
  // necessary with our corrected PushNotification component. It's good practice.
  const addEventMessage = useCallback((message: string) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleSimulateClick = () => {
    // This now calls our interactive mock.
    mockServiceWorker.simulatePushMessage({
      notification: {
        title: "Hello from Storybook!",
        body: "This is a simulated push message.",
      },
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "400px",
      }}
    >
      <h3>Basic Push Notification Example</h3>

      <PushNotification
        askPermission={true}
        onGranted={() => {
          setStatus("Permission granted");
          addEventMessage("Event: Permission Granted");
        }}
        onDenied={() => {
          setStatus("Permission denied");
          addEventMessage("Event: Permission Denied");
        }}
        onMessage={(data) => {
          // The component's onMessage now correctly updates the UI.
          addEventMessage(`Event: Push Received - ${JSON.stringify(data)}`);
        }}
      />

      <div style={{ margin: "15px 0" }}>
        Status:
        <div
          style={{
            display: "inline-block",
            padding: "5px 10px",
            marginLeft: "10px",
            backgroundColor:
              status === "Permission granted"
                ? "#4CAF50"
                : status === "Permission denied"
                  ? "#F44336"
                  : "#FFC107",
            color: "white",
            borderRadius: "4px",
          }}
        >
          {status}
        </div>
      </div>

      <button
        onClick={handleSimulateClick}
        style={{ padding: "8px 12px", marginBottom: "15px" }}
      >
        Simulate Push Message
      </button>

      <div>
        <h4>Events Log:</h4>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            listStyleType: "none",
            margin: 0,
          }}
        >
          {messages.length === 0 ? (
            <div style={{ color: "#666" }}>No events yet.</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "5px",
                  borderBottom:
                    index < messages.length - 1 ? "1px solid #ddd" : "none",
                }}
              >
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Step 4: Combine documentation with the primary story ---
export const Basic: Story = {
  render: () => <BasicPushNotificationExample />,
  parameters: {
    docs: {
      description: {
        story: `
The \`PushNotification\` component is a side-effect component that handles browser push notification logic in React. It does not render any UI itself.

### Features
- **Permission Handling**: Automatically requests user permission if not already set.
- **Lifecycle Callbacks**: Provides \`onGranted\`, \`onDenied\`, and \`onMessage\` callbacks to react to events.
- **Service Worker Integration**: Listens for messages from the active service worker.
- **Resource Cleanup**: Automatically cleans up event listeners when the component unmounts.

### How It Works
The component checks for browser support and the current notification permission state. Based on the \`askPermission\` prop, it may trigger a permission request. It then attaches a listener to \`navigator.serviceWorker\` to handle incoming messages.

\`\`\`tsx
// Example Usage
<PushNotification
  askPermission={true}
  onGranted={() => console.log('Permission granted!')}
  onDenied={() => console.log('Permission denied.')}
  onMessage={(data) => {
    console.log('Push message received:', data);
    // You would typically use this data to show a notification
    // or update the application state.
  }}
/>
\`\`\`

**Note:** For push notifications to work in a real application, you must have a registered service worker capable of receiving push events from a push service. These stories use a mock to simulate this behavior.
        `,
      },
    },
  },
};

// Step 5: Remove redundant/anti-pattern stories like `WithDescription` and `Cleanup`.
// The cleanup is now handled by React's unmounting cycle and the mocks are set at the module level.
