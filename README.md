# Reflex

A declarative UI enhancement library for React applications that helps organize your code and avoid common React pitfalls.

## Overview

Reflex provides a set of declarative components and utilities that simplify common UI patterns and browser APIs in React applications. It allows you to handle complex UI interactions and browser features with a clean, component-based approach.

The main purpose of Reflex is to eliminate the disorganization that often occurs when mixing useState, useEffect, and regular component code. It helps prevent common mistakes like forgetting to handle errors or clean up useEffect hooks.

> **Note:** This project is still in development and we welcome contributors who want to help improve it.

## Installation

```bash
npm install reflex
```

## Key Components

### Signal (Alternative to useState)

Signal provides a more flexible state management solution compared to useState. Unlike useState which is tied to a specific component, Signal can be shared across components and automatically tracks dependencies.

```jsx
import { createSignal, Signal } from 'reflex';

// Create a signal outside of components
const [count, setCount] = createSignal(0);

function Counter() {
  return (
    <div>
      {/* Signal automatically subscribes to changes */}
      <Signal value={count}>
        {(value) => (
          <>
            <p>Count: {value}</p>
            <button onClick={() => setCount(value + 1)}>Increment</button>
          </>
        )}
      </Signal>
    </div>
  );
}
```

### WebSocket Integration

Reflex provides a declarative way to work with WebSockets, handling connection management and cleanup automatically:

```jsx
import { WebSocket, OnMessage, OnOpen, OnClose } from 'reflex';

function WebSocketExample() {
  return (
    <WebSocket url="wss://echo.example.com">
      <OnOpen>
        {() => console.log('Connected to WebSocket server')}
      </OnOpen>

      <OnMessage>
        {(event) => console.log('Received message:', event.data)}
      </OnMessage>

      <OnClose>
        {() => console.log('Disconnected from WebSocket server')}
      </OnClose>

      <button onClick={() => {
        const socket = document.querySelector('[data-testid="websocket"]').value;
        socket.send('Hello, WebSocket!');
      }}>
        Send Message
      </button>
    </WebSocket>
  );
}
```

### Push Notifications

Handle browser notifications with a clean component-based approach:

```jsx
import { PushNotification } from 'reflex';

function NotificationExample() {
  return (
    <PushNotification
      askPermission={true}
      onGranted={() => console.log('Notification permission granted')}
      onDenied={() => console.log('Notification permission denied')}
      onMessage={(data) => console.log('Received notification:', data)}
    />
  );
}
```

### Async Component

Handle asynchronous operations declaratively without complex useState/useEffect combinations:

```jsx
import { Async, AsyncPending, AsyncFulfilled, AsyncRejected } from 'reflex';

function AsyncExample() {
  const fetchData = async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
  };

  return (
    <Async task={fetchData}>
      <AsyncPending>
        <p>Loading data...</p>
      </AsyncPending>

      <AsyncFulfilled>
        {(data) => (
          <div>
            <h3>Data loaded successfully!</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </AsyncFulfilled>

      <AsyncRejected>
        {(error) => (
          <div>
            <h3>Error loading data</h3>
            <p>{error.message}</p>
          </div>
        )}
      </AsyncRejected>
    </Async>
  );
}
```

### Loop Component

Iterate over arrays or signals with automatic updates when data changes:

```jsx
import { Loop, createSignal } from 'reflex';

function LoopExample() {
  const [items, setItems] = createSignal(['Item 1', 'Item 2', 'Item 3']);

  return (
    <div>
      <Loop each={items}>
        {(item, index) => (
          <div key={index}>
            <p>{item}</p>
            <button onClick={() => {
              const newItems = [...items()];
              newItems.splice(index, 1);
              setItems(newItems);
            }}>
              Remove
            </button>
          </div>
        )}
      </Loop>

      <button onClick={() => setItems([...items(), `Item ${items().length + 1}`])}>
        Add Item
      </button>
    </div>
  );
}
```

### VirtualList

Efficiently render large lists by only rendering the visible items:

```jsx
import { VirtualList } from 'reflex';

function VirtualListExample() {
  // Create a large array of items
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  return (
    <VirtualList
      items={items}
      height={400}
      estimatedItemHeight={50}
    >
      {(item, index) => (
        <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
          {item} (index: {index})
        </div>
      )}
    </VirtualList>
  );
}
```

## Other Components

Reflex includes many other useful components:

- **When**: Conditional rendering
- **Cond/Otherwise**: Multi-branch conditional rendering
- **OnMount/OnUpdate**: Lifecycle hooks as components
- **AnimatePresence**: Animation coordination
- **Portal**: Render content in a different DOM node
- **Action**: Declarative side effects
- **BindInput/BindText**: Two-way binding for form elements

## Philosophy

The main philosophy of Reflex is to avoid mixing imperative code with declarative code, even when using JSX elements with arrow functions. This separation makes your code more maintainable, easier to reason about, and less prone to bugs.

Traditional React components often mix imperative logic (like state updates, side effects, and event handlers) with declarative UI rendering. This can lead to complex, hard-to-maintain components. Reflex provides a more structured approach by encapsulating common patterns in declarative components.

## Roadmap

Reflex is actively being developed with several exciting features on the horizon:

### Server-Side Rendering (SSR) Support

We're working on adding full SSR support to make Reflex compatible with frameworks like Next.js and Remix. This will allow you to use Reflex components in server-rendered applications.

### More Common APIs

We're expanding our library to include more declarative wrappers for common browser APIs and patterns that developers frequently need to reimplement, such as:

- Form validation
- Internationalization (i18n)
- Authentication flows
- Drag and drop
- Keyboard shortcuts
- Clipboard operations
- Local storage/session storage

### External Library Adapters

To improve interoperability with the React ecosystem, we're developing adapters for popular external libraries. These adapters will provide a consistent, declarative interface for using third-party components within the Reflex philosophy:

- UI component libraries (Material UI, Chakra UI, etc.)
- Animation libraries (Framer Motion, React Spring)
- Form libraries (React Hook Form, Formik)
- State management libraries (Redux, Zustand, Jotai)

## Requirements

- React 19 or higher
- React DOM 19 or higher

## Contributing

We welcome contributions to Reflex! If you're interested in helping improve the library, please feel free to submit pull requests or open issues on our GitHub repository.

## License

MIT

## ☕ Support Reflex

If this project helps you, consider supporting:

👉 [buymeacoffee.com/lovizotto](https://buymeacoffee.com/lovizotto)
