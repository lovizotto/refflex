# Reflex

A declarative UI enhancement library for React applications.

## Overview

Reflex provides a set of declarative components and utilities that simplify common UI patterns and browser APIs in React applications. It allows you to handle complex UI interactions and browser features with a clean, component-based approach.

## Installation

```bash
npm install reflex
```

## Features

Reflex offers various components to enhance your React applications:

### Conditional Rendering

```jsx
import { When } from 'reflex';

function MyComponent({ isLoggedIn, user }) {
  return (
    <div>
      <When truthy={isLoggedIn}>
        <p>Welcome, {user.name}!</p>
      </When>
    </div>
  );
}
```

### WebSocket Integration

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

## Requirements

- React 19 or higher
- React DOM 19 or higher

## License

MIT

## ☕ Apoie o Reflex

Se esse projeto te ajuda, considere apoiar:

👉 [buymeacoffee.com/lovizotto](https://buymeacoffee.com/lovizotto)