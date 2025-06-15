import React from 'react';
import { Rf } from '../Rf';
import { createSignal } from '../core/createSignal';
import { ProvideSlots } from '../components/Slot.tsx';
import { Signal } from '../components/Signal.tsx';

const ExamplesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Reflex Components Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Signal Example */}
        <ExampleCard title="Signal">
          <SignalExample />
        </ExampleCard>

        {/* Show Example */}
        <ExampleCard title="Show">
          <ShowExample />
        </ExampleCard>

        {/* Action Example */}
        <ExampleCard title="Action">
          <ActionExample />
        </ExampleCard>

        {/* Timer Example */}
        <ExampleCard title="Timer">
          <TimerExample />
        </ExampleCard>

        {/* When Example */}
        <ExampleCard title="When">
          <WhenExample />
        </ExampleCard>

        {/* Loop Example */}
        <ExampleCard title="Loop">
          <LoopExample />
        </ExampleCard>

        {/* Cond Example */}
        <ExampleCard title="Cond">
          <CondExample />
        </ExampleCard>

        {/* OnMount Example */}
        <ExampleCard title="OnMount">
          <OnMountExample />
        </ExampleCard>

        {/* OnUpdate Example */}
        <ExampleCard title="OnUpdate">
          <OnUpdateExample />
        </ExampleCard>

        {/* Memo Example */}
        <ExampleCard title="Memo">
          <MemoExample />
        </ExampleCard>

        {/* BindInput Example */}
        <ExampleCard title="BindInput">
          <BindInputExample />
        </ExampleCard>

        {/* BindText Example */}
        <ExampleCard title="BindText">
          <BindTextExample />
        </ExampleCard>

        {/* FadeIn Example */}
        <ExampleCard title="FadeIn">
          <FadeInExample />
        </ExampleCard>

        {/* SlideIn Example */}
        <ExampleCard title="SlideIn">
          <SlideInExample />
        </ExampleCard>

        {/* AnimatePresence Example */}
        <ExampleCard title="AnimatePresence">
          <AnimatePresenceExample />
        </ExampleCard>

        {/* Portal Example */}
        <ExampleCard title="Portal">
          <PortalExample />
        </ExampleCard>

        {/* OnResize Example */}
        <ExampleCard title="OnResize">
          <OnResizeExample />
        </ExampleCard>

        {/* VirtualList Example */}
        <ExampleCard title="VirtualList">
          <VirtualListExample />
        </ExampleCard>

        {/* Async Example */}
        <ExampleCard title="Async">
          <AsyncExample />
        </ExampleCard>

        {/* Slot Example */}
        <ExampleCard title="Slot">
          <SlotExample />
        </ExampleCard>

        {/* TransitionZone Example */}
        <ExampleCard title="TransitionZone">
          <TransitionZoneExample />
        </ExampleCard>

        {/* StateGroup Example */}
        <ExampleCard title="StateGroup">
          <StateGroupExample />
        </ExampleCard>

        {/* ViewState Example */}
        <ExampleCard title="ViewState">
          <ViewStateExample />
        </ExampleCard>

        {/* Run Example */}
        <ExampleCard title="Run">
          <RunExample />
        </ExampleCard>

        {/* PushNotification Example */}
        <ExampleCard title="Push">
          <PushNotificationExample />
        </ExampleCard>

        {/* WebSocket Example */}
        <ExampleCard title="WebSocket">
          <WebSocketExample />
        </ExampleCard>

        {/* ReadableStream Example */}
        <ExampleCard title="ReadableStream">
          <ReadableStreamExample />
        </ExampleCard>

        {/* ServiceWorker Example */}
        <ExampleCard title="ServiceWorker">
          <ServiceWorkerExample />
        </ExampleCard>

        {/* Resource Example */}
        <ExampleCard title="Resource">
          <ResourceExample />
        </ExampleCard>
      </div>
    </div>
  );
};

// Reusable card component for examples
interface ExampleCardProps {
  title: string;
  children: React.ReactNode;
}

const ExampleCard = ({ title, children }: ExampleCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-500 text-white py-2 px-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

// Signal Example
const SignalExample = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setCount(count() + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Increment
      </button>

      <Rf.Signal value={count}>
        {(value) => <div className="text-lg font-medium">Count: {value}</div>}
      </Rf.Signal>
    </div>
  );
};

// Show Example
const ShowExample = () => {
  const [isVisible, setIsVisible] = createSignal(true);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsVisible(!isVisible())}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        {isVisible() ? 'Hide Content' : 'Show Content'}
      </button>

      <Rf.Show when={isVisible()}>
        <div className="bg-gray-100 p-3 rounded text-center">
          This content is conditionally rendered.
        </div>
      </Rf.Show>
    </div>
  );
};

// Action Example
const ActionExample = () => {
  const [count, setCount] = createSignal(0);
  const [lastAction, setLastAction] = createSignal('None');

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setCount(count() + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Increment Count
      </button>

      <Rf.Signal value={count}>
        {(value) => <div className="text-lg font-medium">Count: {value}</div>}
      </Rf.Signal>

      <Rf.Signal value={lastAction}>
        {(value) => (
          <div className="text-sm text-gray-600 mt-2">Last Action: {value}</div>
        )}
      </Rf.Signal>

      <Rf.Action
        watch={() => count()}
        onTrigger={(value) => setLastAction(`Count changed to ${value}`)}
      />
    </div>
  );
};

// Timer Example
const TimerExample = () => {
  const [seconds, setSeconds] = createSignal(0);
  const [isRunning, setIsRunning] = createSignal(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setIsRunning(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
          disabled={isRunning()}
        >
          Start
        </button>
        <button
          onClick={() => setIsRunning(false)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
          disabled={!isRunning()}
        >
          Stop
        </button>
        <button
          onClick={() => setSeconds(0)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      <Rf.Signal value={seconds}>
        {(value) => <div className="text-2xl font-bold">{value}s</div>}
      </Rf.Signal>

      <Rf.When truthy={isRunning()}>
        <Rf.Timer
          delay={1000}
          interval={true}
          do={() => setSeconds(seconds() + 1)}
        />
      </Rf.When>
    </div>
  );
};

// When Example
const WhenExample = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setCount(count() - 1)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          -
        </button>
        <Rf.Signal value={count}>
          {(value) => (
            <div className="text-xl font-bold px-4 py-2">{value}</div>
          )}
        </Rf.Signal>
        <button
          onClick={() => setCount(count() + 1)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          +
        </button>
      </div>

      <Rf.When truthy={count() > 0}>
        <div className="bg-green-100 text-green-800 p-2 rounded">
          Count is positive
        </div>
      </Rf.When>

      <Rf.When truthy={count() < 0}>
        <div className="bg-red-100 text-red-800 p-2 rounded mt-2">
          Count is negative
        </div>
      </Rf.When>

      <Rf.When truthy={count() === 0}>
        <div className="bg-gray-100 text-gray-800 p-2 rounded mt-2">
          Count is zero
        </div>
      </Rf.When>
    </div>
  );
};

// Loop Example
const LoopExample = () => {
  const [items, setItems] = createSignal([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ]);

  const addItem = () => {
    const newId =
      items().length > 0 ? Math.max(...items().map((item) => item.id)) + 1 : 1;
    setItems([...items(), { id: newId, name: `Item ${newId}` }]);
  };

  const removeItem = (id) => {
    setItems(items().filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={addItem}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3 self-start"
      >
        Add Item
      </button>

      <div className="space-y-2">
        <Rf.Loop each={items()} keyExtractor={(item) => item.id}>
          {(item) => (
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{item.name}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </Rf.Loop>
      </div>
    </div>
  );
};

// Cond Example
const [status, setStatus] = createSignal('idle');
const CondExample = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setStatus('idle')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Idle
        </button>
        <button
          onClick={() => setStatus('loading')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Loading
        </button>
        <button
          onClick={() => setStatus('success')}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          Success
        </button>
        <button
          onClick={() => setStatus('error')}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Error
        </button>
      </div>

      <Rf.Signal value={status}>
        {(value) => (
          <div className="text-sm text-gray-600 mb-3">
            Current status: {value}
          </div>
        )}
      </Rf.Signal>

      <Rf.Cond
        condition={() =>
          ['idle', 'loading', 'success', 'error'].includes(status())
        }
      >
        <Rf.When truthy={status() === 'idle'}>
          <div className="bg-gray-100 p-3 rounded text-center">
            Ready to start
          </div>
        </Rf.When>
        <Rf.When truthy={status() === 'loading'}>
          <div className="bg-blue-100 p-3 rounded text-center">Loading...</div>
        </Rf.When>
        <Rf.When truthy={status() === 'success'}>
          <div className="bg-green-100 p-3 rounded text-center">
            Operation successful!
          </div>
        </Rf.When>
        <Rf.When truthy={status() === 'error'}>
          <div className="bg-red-100 p-3 rounded text-center">
            An error occurred!
          </div>
        </Rf.When>
        <Rf.Otherwise>
          <div className="bg-yellow-100 p-3 rounded text-center">
            Unknown status
          </div>
        </Rf.Otherwise>
        <Rf.EndCond />
      </Rf.Cond>
    </div>
  );
};

// OnMount Example
const [mountTime, setMountTime] = createSignal(null);
const OnMountExample = () => {
  return (
    <div className="flex flex-col items-center">
      <Rf.OnMount
        do={() => {
          setMountTime(new Date().toLocaleTimeString());
        }}
      />

      <Rf.Signal value={mountTime}>
        {(value) => (
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              Component mounted at:
            </div>
            <div className="text-lg font-medium">
              {value || 'Not mounted yet'}
            </div>
          </div>
        )}
      </Rf.Signal>
    </div>
  );
};

// OnUpdate Example
const [count, setCount] = createSignal(0);
const [lastUpdate, setLastUpdate] = createSignal('None');
const OnUpdateExample = () => {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setCount(count() + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Update Count
      </button>

      <Rf.Signal value={count}>
        {(value) => <div className="text-lg font-medium">Count: {value}</div>}
      </Rf.Signal>

      <Rf.Signal value={lastUpdate}>
        {(value) => (
          <div className="text-sm text-gray-600 mt-2">Last Update: {value}</div>
        )}
      </Rf.Signal>

      <Rf.OnUpdate watch={() => count()}>
        {(value) => {
          setLastUpdate(
            `Changed from ${value} to ${value} at ${new Date().toLocaleTimeString()}`,
          );
        }}
      </Rf.OnUpdate>
    </div>
  );
};

// Memo Example

const MemoExample = () => {
  const [a, setA] = createSignal(0);
  const [b, setB] = createSignal(0);

  // Expensive calculation (simulated)
  const calculateSum = (a, b) => {
    console.log('Calculating sum...');
    return a + b;
  };

  return (
    <div className="flex flex-col">
      <div className="flex space-x-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value A
          </label>
          <input
            type="number"
            defaultValue={a()}
            onChange={(e) => setA(parseInt(e.target.value) || 0)}
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value B
          </label>
          <input
            type="number"
            defaultValue={b()}
            onChange={(e) => setB(parseInt(e.target.value) || 0)}
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
      </div>

      <Rf.Memo deps={[a(), b()]} compute={() => [a(), b()]}>
        {([aValue, bValue]) => (
          <div className="bg-gray-100 p-3 rounded">
            <div className="text-sm text-gray-600 mb-1">
              Memoized Calculation:
            </div>
            <div className="text-lg font-medium">
              {aValue} + {bValue} = {calculateSum(aValue, bValue)}
            </div>
          </div>
        )}
      </Rf.Memo>
    </div>
  );
};

// BindInput Example
const [text, setText] = createSignal('');
const BindInputExample = () => {
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter text:
      </label>

      <Rf.Signal value={text}>
        {(value) => (
          <>
            <Rf.BindInput
              signal={[text, setText]}
              className="border border-gray-300 rounded px-3 py-2 mb-3"
              placeholder="Type something..."
            />
            <div className="bg-gray-100 p-3 rounded">
              <div className="text-sm text-gray-600 mb-1">You typed:</div>
              <div className="text-lg font-medium break-words">
                {value || '(empty)'}
              </div>
            </div>
          </>
        )}
      </Rf.Signal>
    </div>
  );
};

// BindText Example
const BindTextExample = () => {
  const [text, setText] = createSignal('Edit this text');

  return (
    <div className="flex flex-col">
      <Rf.Signal value={text}>
        {() => (
          <div className="bg-gray-100 p-3 rounded">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Editable text:
            </label>
            <textarea
              value={text()}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 mb-3 min-h-[100px]"
            />
            <div className="text-sm text-gray-600 mb-1">Content:</div>
            <div className="text-lg font-medium break-words">
              {text() || '(empty)'}
            </div>
          </div>
        )}
      </Rf.Signal>
    </div>
  );
};

// FadeIn Example
const [isVisible, setIsVisible] = createSignal(false);
const FadeInExample = () => {
  return (
    <Signal value={isVisible}>
      {(isVisible) => (
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>

          {isVisible && (
            <Rf.FadeIn duration={500}>
              <div className="bg-blue-100 p-4 rounded text-center">
                This content fades in smoothly
              </div>
            </Rf.FadeIn>
          )}
        </div>
      )}
    </Signal>
  );
};

// SlideIn Example
const SlideInExample = () => {
  const [isVisible, setIsVisible] = createSignal(false);

  return (
    <div className="flex flex-col items-center">
      <Signal value={isVisible}>
        {(isVisible) => (
          <>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
            >
              {isVisible ? 'Hide' : 'Show'}
            </button>
            <Rf.SlideIn
              from="top"
              duration={500}
              distance={isVisible ? 0 : 100}
            >
              <div className="bg-green-100 p-4 rounded text-center">
                This content slides in from the right
              </div>
            </Rf.SlideIn>
          </>
        )}
      </Signal>
    </div>
  );
};

// AnimatePresence Example
const AnimatePresenceExample = () => {
  const [isVisible, setIsVisible] = createSignal(true);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsVisible(!isVisible())}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Toggle
      </button>

      <Signal value={isVisible}>
        {(isVisible) => (
          <>
            <Rf.AnimatePresence show={isVisible}>
              <div
                className="bg-purple-100 p-4 rounded text-center"
                style={{
                  animation: isVisible ? 'fadeIn 0.5s' : 'fadeOut 0.5s',
                }}
              >
                This content animates in and out
              </div>
            </Rf.AnimatePresence>
          </>
        )}
      </Signal>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Portal Example
const PortalExample = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
      >
        Open Modal
      </button>

      <Rf.Portal>
        {isOpen() && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-4">Portal Modal</h3>
              <p className="mb-4">
                This modal is rendered outside the DOM hierarchy using Portal.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Rf.Portal>
    </div>
  );
};

// OnResize Example
const OnResizeExample = () => {
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-3">
        <div className="text-sm text-gray-600">Resize your browser window</div>
      </div>

      <Rf.OnResize
        on={({ width, height }) => {
          setSize({ width, height });
        }}
      />

      <Rf.Signal value={size}>
        {(value) => (
          <div className="bg-gray-100 p-3 rounded text-center">
            <div>Width: {value.width}px</div>
            <div>Height: {value.height}px</div>
          </div>
        )}
      </Rf.Signal>
    </div>
  );
};

// VirtualList Example
const VirtualListExample = () => {
  // Generate a large list of items
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  return (
    <div className="flex flex-col">
      <div className="text-sm text-gray-600 mb-2">
        Virtual list with 1000 items:
      </div>

      <div className="border border-gray-300 rounded h-40 overflow-auto">
        <Rf.VirtualList items={items} height={160} estimatedItemHeight={30}>
          {(item) => (
            <div className="px-3 py-1 border-b border-gray-200 hover:bg-gray-50">
              {item as string}
            </div>
          )}
        </Rf.VirtualList>
      </div>
    </div>
  );
};

// Async Example
const AsyncExample = () => {
  const [id, setId] = createSignal(1);

  const fetchUser = async (id: number) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (id < 1 || id > 10) {
      throw new Error('User not found');
    }

    return {
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
    };
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <label className="text-sm font-medium text-gray-700">User ID:</label>
        <input
          type="number"
          value={id()}
          onChange={(e) => setId(parseInt(e.target.value) || 0)}
          className="border border-gray-300 rounded px-3 py-1 w-20"
          min="1"
        />
      </div>

      <Rf.Async task={() => fetchUser(id())}>
        <Rf.Pending>
          <div className="bg-blue-100 p-3 rounded text-center">
            Loading user data...
          </div>
        </Rf.Pending>
        <Rf.Fulfilled>
          {(user: { id: number; name: string; email: string }) => (
            <div className="bg-green-100 p-3 rounded">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          )}
        </Rf.Fulfilled>
        <Rf.Rejected>
          {(error) => (
            <div className="bg-red-100 p-3 rounded text-center text-red-600">
              Error: {(error as Error).message}
            </div>
          )}
        </Rf.Rejected>
        <Rf.EndAsync />
      </Rf.Async>
    </div>
  );
};

// Slot Example
const SlotExample = () => {
  interface CardProps {
    children: React.ReactNode;
  }

  const Card = ({ children }: CardProps) => (
    <Rf.ProvideSlots
      slots={{
        header: <div className="text-lg font-medium">Default Header</div>,
        content: <div>Default Content</div>,
        footer: <div className="text-sm text-gray-600">Default Footer</div>,
      }}
    >
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="bg-gray-100 p-3 border-b border-gray-300">
          <Rf.Slot name="header" />
        </div>
        <div className="p-4">
          <Rf.Slot name="content" />
        </div>
        <div className="bg-gray-100 p-3 border-t border-gray-300">
          <Rf.Slot name="footer" />
        </div>
      </div>
      {children}
    </Rf.ProvideSlots>
  );

  return (
    <div>
      <ProvideSlots
        slots={{
          header: (
            <div className="text-lg font-medium text-blue-600">
              Custom Card Header
            </div>
          ),
          content: (
            <div className="py-2">
              <p>This is custom content for the card.</p>
              <p className="mt-2">
                Slots allow for flexible component composition.
              </p>
            </div>
          ),
          footer: (
            <div className="text-sm text-gray-600">
              Custom Footer - Created at {new Date().toLocaleDateString()}
            </div>
          ),
        }}
      >
        <Card>
          <Rf.Slot name="header" />

          <Rf.Slot name="content" />

          <Rf.Slot name="footer" />
        </Card>
      </ProvideSlots>
    </div>
  );
};

// TransitionZone Example
const TransitionZoneExample = () => {
  const [content, setContent] = createSignal('Initial content');
  const [isLoading, setIsLoading] = createSignal(false);

  const loadNewContent = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setContent(`New content loaded at ${new Date().toLocaleTimeString()}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={loadNewContent}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
        disabled={isLoading()}
      >
        {isLoading() ? 'Loading...' : 'Load New Content'}
      </button>

      <div className="bg-gray-100 p-4 rounded w-full">
        <Rf.TransitionZone>
          {isLoading() ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="text-center">{content()}</div>
          )}
        </Rf.TransitionZone>
      </div>
    </div>
  );
};

// StateGroup Example
const StateGroupExample = () => {
  const [currentState, setCurrentState] = createSignal('idle');

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setCurrentState('idle')}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Idle
        </button>
        <button
          onClick={() => setCurrentState('loading')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Loading
        </button>
        <button
          onClick={() => setCurrentState('success')}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
        >
          Success
        </button>
        <button
          onClick={() => setCurrentState('error')}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Error
        </button>
      </div>

      <Rf.Signal value={currentState}>
        {(value) => (
          <div className="text-sm text-gray-600 mb-3">
            Current state: {value}
          </div>
        )}
      </Rf.Signal>

      <div className="bg-gray-100 p-4 rounded w-full">
        <Rf.StateGroup state={() => currentState()} fallback={<div>Unknown state</div>}>
          <Rf.State name="idle">
            <div className="bg-gray-200 p-3 rounded text-center">
              Ready to start
            </div>
          </Rf.State>
          <Rf.State name="loading">
            <div className="bg-blue-100 p-3 rounded text-center">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
                Loading...
              </div>
            </div>
          </Rf.State>
          <Rf.State name="success">
            <div className="bg-green-100 p-3 rounded text-center">
              Operation successful!
            </div>
          </Rf.State>
          <Rf.State name="error">
            <div className="bg-red-100 p-3 rounded text-center">
              An error occurred!
            </div>
          </Rf.State>
        </Rf.StateGroup>
      </div>
    </div>
  );
};

// ViewState Example
const ViewStateExample = () => {
  const [view, setView] = createSignal('list');
  const [selectedItem, setSelectedItem] = createSignal(null);

  const items = [
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', description: 'Description for Item 3' },
  ];

  const selectItem = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setView('list')}
          className={`py-2 px-4 rounded ${
            view() === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView('grid')}
          className={`py-2 px-4 rounded ${
            view() === 'grid'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Grid View
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <Rf.ViewState state={() => view()}>
          <Rf.State name="list">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
                  onClick={() => selectItem(item)}
                >
                  <span>{item.name}</span>
                  <button className="text-blue-500 text-sm">View</button>
                </div>
              ))}
            </div>
          </Rf.State>
          <Rf.State name="grid">
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded shadow-sm text-center"
                  onClick={() => selectItem(item)}
                >
                  <div className="font-medium">{item.name}</div>
                  <button className="text-blue-500 text-sm mt-2">View</button>
                </div>
              ))}
            </div>
          </Rf.State>
          <Rf.State name="detail">
            <div className="bg-white p-4 rounded shadow-sm">
              <button
                onClick={() => setView('list')}
                className="text-blue-500 mb-3"
              >
                ← Back to list
              </button>
              {selectedItem() && (
                <div>
                  <h3 className="text-lg font-medium">{selectedItem().name}</h3>
                  <p className="text-gray-600 mt-2">
                    {selectedItem().description}
                  </p>
                </div>
              )}
            </div>
          </Rf.State>
        </Rf.ViewState>
      </div>
    </div>
  );
};

// Run Example
const RunExample = () => {
  const [count, setCount] = createSignal(0);
  const [multiplier, setMultiplier] = createSignal(2);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => setCount(count() + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Increment Count
        </button>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Multiplier:
        </label>
        <select
          value={multiplier()}
          onChange={(e) => setMultiplier(Number(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="bg-gray-100 p-4 rounded text-center">
        <div className="text-sm text-gray-600 mb-1">Count:</div>
        <div className="text-lg font-medium">{count()}</div>

        <div className="mt-3 text-sm text-gray-600 mb-1">
          Count × Multiplier:
        </div>
        <Rf.Run watch={() => ({ count: count(), multiplier: multiplier() })}>
          {({ count, multiplier }) => (
            <div className="text-lg font-medium">{count * multiplier}</div>
          )}
        </Rf.Run>
      </div>
    </div>
  );
};

// PushNotification Example
const PushNotificationExample = () => {
  const [permission, setPermission] = createSignal('default');
  const [message, setMessage] = createSignal(null);

  const sendTestNotification = () => {
    // This is just a simulation since we can't actually send push notifications in this example
    window.postMessage(
      {
        type: 'push',
        data: { title: 'Test Notification', body: 'This is a test notification' },
      },
      '*'
    );
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 p-4 rounded mb-3">
        <div className="text-sm text-gray-600 mb-2">
          Current notification permission:
        </div>
        <div className="font-medium">
          {permission() === 'granted' && (
            <span className="text-green-600">Granted</span>
          )}
          {permission() === 'denied' && (
            <span className="text-red-600">Denied</span>
          )}
          {permission() === 'default' && (
            <span className="text-gray-600">Not requested</span>
          )}
        </div>
      </div>

      <button
        onClick={() => Notification.requestPermission().then(setPermission)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
        disabled={permission() !== 'default'}
      >
        Request Permission
      </button>

      <button
        onClick={sendTestNotification}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mb-3"
        disabled={permission() !== 'granted'}
      >
        Send Test Notification
      </button>

      <Rf.PushNotification
        askPermission={false}
        onGranted={() => setPermission('granted')}
        onDenied={() => setPermission('denied')}
        onMessage={(data) => setMessage(data)}
      />

      {message() && (
        <div className="bg-blue-100 p-3 rounded mt-3">
          <div className="font-medium">{message().title}</div>
          <div className="text-sm text-gray-600">{message().body}</div>
        </div>
      )}
    </div>
  );
};

// WebSocket Example
const WebSocketExample = () => {
  const [messages, setMessages] = createSignal([]);
  const [connected, setConnected] = createSignal(false);
  const [inputMessage, setInputMessage] = createSignal('');

  // Note: This is a mock implementation since we can't actually connect to a WebSocket server in this example
  const mockWebSocketUrl = 'wss://echo.websocket.org';

  const sendMessage = () => {
    if (!inputMessage().trim()) return;

    // In a real implementation, this would send the message through the WebSocket
    const newMessage = {
      text: inputMessage(),
      sender: 'You',
      time: new Date().toLocaleTimeString(),
    };

    setMessages([...messages(), newMessage]);
    setInputMessage('');

    // Simulate echo response after a short delay
    setTimeout(() => {
      const echoMessage = {
        text: inputMessage(),
        sender: 'Echo Server',
        time: new Date().toLocaleTimeString(),
      };
      setMessages([...messages(), echoMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 p-3 rounded mb-3 flex justify-between items-center">
        <div className="text-sm">
          Status:{' '}
          {connected() ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Disconnected</span>
          )}
        </div>
        <button
          onClick={() => setConnected(!connected())}
          className={`text-sm py-1 px-2 rounded ${
            connected()
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {connected() ? 'Disconnect' : 'Connect'}
        </button>
      </div>

      <div className="border border-gray-300 rounded h-40 overflow-auto mb-3 p-2 bg-white">
        {messages().length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No messages yet
          </div>
        ) : (
          <div className="space-y-2">
            {messages().map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  msg.sender === 'You'
                    ? 'bg-blue-100 ml-auto mr-0 max-w-[80%]'
                    : 'bg-gray-100 mr-auto ml-0 max-w-[80%]'
                }`}
              >
                <div className="text-sm font-medium">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500">{msg.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          value={inputMessage()}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l px-3 py-2"
          disabled={!connected()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-r"
          disabled={!connected() || !inputMessage().trim()}
        >
          Send
        </button>
      </div>

      {connected() && (
        <div className="text-xs text-gray-500 mt-2">
          Note: This is a simulated WebSocket connection for demonstration purposes.
        </div>
      )}

      {/* In a real implementation, we would use the WebSocket component like this: */}
      {/* 
      <Rf.WebSocket.Provider url={mockWebSocketUrl}>
        <Rf.WebSocket.OnOpen>
          {() => setConnected(true)}
        </Rf.WebSocket.OnOpen>
        <Rf.WebSocket.OnClose>
          {() => setConnected(false)}
        </Rf.WebSocket.OnClose>
        <Rf.WebSocket.OnMessage>
          {(event) => {
            const message = {
              text: event.data,
              sender: 'Server',
              time: new Date().toLocaleTimeString(),
            };
            setMessages([...messages(), message]);
          }}
        </Rf.WebSocket.OnMessage>
      </Rf.WebSocket.Provider>
      */}
    </div>
  );
};

// ReadableStream Example
const ReadableStreamExample = () => {
  const [chunks, setChunks] = createSignal([]);
  const [isStreaming, setIsStreaming] = createSignal(false);
  const [progress, setProgress] = createSignal(0);

  const startStream = () => {
    setChunks([]);
    setIsStreaming(true);
    setProgress(0);

    // Simulate a ReadableStream with random data
    const simulateStream = () => {
      let counter = 0;
      const controller = new ReadableStreamDefaultController();

      const interval = setInterval(() => {
        if (counter >= 10) {
          clearInterval(interval);
          controller.close();
          setIsStreaming(false);
          return;
        }

        const chunk = new Uint8Array([counter + 65]); // ASCII values starting from 'A'
        controller.enqueue(chunk);
        counter++;
        setProgress(counter * 10);
      }, 500);

      return controller.stream;
    };

    // This is a mock implementation since we can't actually create a ReadableStream in this example
    const mockStream = {
      getReader: () => ({
        read: async () => {
          // This is just for demonstration purposes
          return { done: false, value: new Uint8Array([65]) };
        },
        releaseLock: () => {},
        cancel: async () => {}
      })
    };

    // In a real implementation, we would use the ReadableStream component like this:
    // <Rf.ReadableStream
    //   src={simulateStream()}
    //   onChunk={(chunk) => {
    //     const decoder = new TextDecoder();
    //     const text = decoder.decode(chunk);
    //     setChunks([...chunks(), text]);
    //   }}
    //   onDone={() => setIsStreaming(false)}
    // />

    // Simulate receiving chunks
    let counter = 0;
    const interval = setInterval(() => {
      if (counter >= 10) {
        clearInterval(interval);
        setIsStreaming(false);
        return;
      }

      const text = String.fromCharCode(65 + counter); // ASCII values starting from 'A'
      setChunks([...chunks(), text]);
      counter++;
      setProgress(counter * 10);
    }, 500);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={startStream}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
        disabled={isStreaming()}
      >
        {isStreaming() ? 'Streaming...' : 'Start Stream'}
      </button>

      {isStreaming() && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Progress:</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress()}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <div className="text-sm text-gray-600 mb-2">Received chunks:</div>
        {chunks().length === 0 ? (
          <div className="text-gray-500">No data received yet</div>
        ) : (
          <div className="font-mono bg-white p-3 rounded border border-gray-300">
            {chunks().join(' ')}
          </div>
        )}
      </div>
    </div>
  );
};

// ServiceWorker Example
const ServiceWorkerExample = () => {
  const [status, setStatus] = createSignal('Not registered');
  const [updateAvailable, setUpdateAvailable] = createSignal(false);

  const registerServiceWorker = () => {
    setStatus('Registering...');

    // In a real implementation, we would use the ServiceWorker component like this:
    // <Rf.ServiceWorker
    //   path="/service-worker.js"
    //   onRegistered={() => setStatus('Registered')}
    //   onUpdate={() => setUpdateAvailable(true)}
    //   onError={(err) => setStatus(`Error: ${err.message}`)}
    // />

    // Simulate registration
    setTimeout(() => {
      setStatus('Registered');

      // Simulate update available after some time
      setTimeout(() => {
        setUpdateAvailable(true);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 p-4 rounded mb-3">
        <div className="text-sm text-gray-600 mb-1">Status:</div>
        <div className="font-medium">{status()}</div>
      </div>

      <button
        onClick={registerServiceWorker}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
        disabled={status() === 'Registering...' || status() === 'Registered'}
      >
        Register Service Worker
      </button>

      {updateAvailable() && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                A new version is available. Refresh the page to update.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        Note: This is a simulated Service Worker registration for demonstration purposes.
      </div>
    </div>
  );
};

// Resource Example
const ResourceExample = () => {
  const [id, setId] = createSignal(1);

  const fetchData = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (id() < 1 || id() > 10) {
      throw new Error('Resource not found');
    }

    return {
      id: id(),
      title: `Resource ${id()}`,
      description: `This is the description for resource ${id()}`,
    };
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <label className="text-sm font-medium text-gray-700">Resource ID:</label>
        <input
          type="number"
          value={id()}
          onChange={(e) => setId(parseInt(e.target.value) || 0)}
          className="border border-gray-300 rounded px-3 py-1 w-20"
          min="1"
        />
        <button
          onClick={() => setId(Math.floor(Math.random() * 12) + 1)} // 1-12 to sometimes trigger errors
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-2 rounded text-sm"
        >
          Random
        </button>
      </div>

      <Rf.Resource task={fetchData}>
        <Rf.ResourcePending>
          <div className="bg-blue-100 p-4 rounded text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
              Loading resource...
            </div>
          </div>
        </Rf.ResourcePending>
        <Rf.ResourceFulfilled>
          {(data) => (
            <div className="bg-green-100 p-4 rounded">
              <h3 className="text-lg font-medium">{data.title}</h3>
              <p className="text-gray-600 mt-2">{data.description}</p>
              <div className="text-sm text-gray-500 mt-3">ID: {data.id}</div>
            </div>
          )}
        </Rf.ResourceFulfilled>
        <Rf.ResourceRejected>
          {(error) => (
            <div className="bg-red-100 p-4 rounded text-center text-red-600">
              Error: {error.message}
            </div>
          )}
        </Rf.ResourceRejected>
      </Rf.Resource>
    </div>
  );
};

export default ExamplesPage;
