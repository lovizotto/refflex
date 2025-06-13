import type { Meta, StoryObj } from '@storybook/react-vite';
import { Store, StoreValue, Dispatch } from './Store';
import { useState } from 'react';

const meta = {
  title: 'Components/Store',
  component: Store,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Store>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple counter reducer
const counterReducer = (state: { count: number }, action: { type: string }) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
};

// Example component that uses Store with a simple counter
const BasicStoreExample = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Basic Store Example</h3>

      <Store reducer={counterReducer} initialState={{ count: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <StoreValue key="count-value" storeKey="count">
            {(count) => <p>Current count: {count}</p>}
          </StoreValue>

          <Dispatch>
            {(dispatch) => (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
                <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
                <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
              </div>
            )}
          </Dispatch>
        </div>
      </Store>
    </div>
  );
};

// More complex reducer with multiple state values
const todoReducer = (
  state: { todos: string[]; filter: string },
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter((_, index) => index !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

// Example component that uses Store with a todo list
const TodoStoreExample = () => {
  const [newTodo, setNewTodo] = useState('');

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Todo List Example</h3>

      <Store
        reducer={todoReducer}
        initialState={{ todos: ['Learn React', 'Learn Reflex'], filter: 'all' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Dispatch>
            {(dispatch) => (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add new todo"
                />
                <button
                  onClick={() => {
                    if (newTodo.trim()) {
                      dispatch({ type: 'ADD_TODO', payload: newTodo });
                      setNewTodo('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </Dispatch>

          <div style={{ marginBottom: '10px' }}>
            <StoreValue key="filter-value" storeKey="filter">
              {(filter) => (
                <Dispatch>
                  {(dispatch) => (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                      >
                        All
                      </button>
                      <button
                        style={{ fontWeight: filter === 'active' ? 'bold' : 'normal' }}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
                      >
                        Active
                      </button>
                    </div>
                  )}
                </Dispatch>
              )}
            </StoreValue>
          </div>

          <StoreValue key="todos-value" storeKey="todos">
            {(todos) => (
              <StoreValue key="nested-filter-value" storeKey="filter">
                {(filter) => (
                  <Dispatch>
                    {(dispatch) => (
                      <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {todos.map((todo, index) => (
                          <li
                            key={index}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '5px 0',
                              borderBottom: '1px solid #eee',
                            }}
                          >
                            <span>{todo}</span>
                            <button
                              onClick={() => dispatch({ type: 'REMOVE_TODO', payload: index })}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Dispatch>
                )}
              </StoreValue>
            )}
          </StoreValue>
        </div>
      </Store>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicStoreExample />,
};

export const TodoList: Story = {
  render: () => <TodoStoreExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BasicStoreExample />
      <div style={{ height: '20px' }} />
      <TodoStoreExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Store component provides a simple state management solution using React's Context API and useReducer hook.

\`\`\`tsx
import { Store, StoreValue, Dispatch } from './components/Store';

// Define a reducer function
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

// Use the Store component
<Store reducer={counterReducer} initialState={{ count: 0 }}>
  {/* Access state values with StoreValue */}
  <StoreValue key="count-value" storeKey="count">
    {(count) => <p>Current count: {count}</p>}
  </StoreValue>

  {/* Dispatch actions with Dispatch */}
  <Dispatch>
    {(dispatch) => (
      <div>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
      </div>
    )}
  </Dispatch>
</Store>
\`\`\`

The Store component consists of three main parts:

1. **Store**: The main component that creates a context provider with a reducer and initialState.
   - \`reducer\`: A function that takes the current state and an action, and returns the new state.
   - \`initialState\`: The initial state object.
   - \`children\`: The components that will have access to the store.

2. **StoreValue**: A component to access and render values from the store.
   - \`storeKey\`: The key of the state value to access.
   - \`children\`: A render function that receives the value.

3. **Dispatch**: A component to access and use the dispatch function.
   - \`children\`: A render function that receives the dispatch function.

The Store component creates signals for each state property, allowing for efficient updates when only specific parts of the state change.
        `,
      },
    },
  },
};
