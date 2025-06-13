import type { Meta, StoryObj } from '@storybook/react-vite';
import { BindText } from './BindText';
import { createSignal } from '../core/createSignal';
import { useState } from 'react';

const meta = {
  title: 'Components/BindText',
  component: BindText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BindText>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses BindText with a simple signal
const SimpleBindTextExample = () => {
  const [text, setText] = createSignal('Hello, world!');
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>BindText Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={text()}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Text from signal:</strong> <BindText signal={() => text()} />
      </div>
    </div>
  );
};

// Example component that uses BindText with a computed signal
const ComputedBindTextExample = () => {
  const [firstName, setFirstName] = createSignal('John');
  const [lastName, setLastName] = createSignal('Doe');
  
  // Computed signal that combines first and last name
  const fullName = () => `${firstName()} ${lastName()}`;
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Computed BindText Example</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
        <input
          type="text"
          value={firstName()}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
        <input
          type="text"
          value={lastName()}
          onChange={(e) => setLastName(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p>Full Name: <BindText signal={fullName} /></p>
      </div>
    </div>
  );
};

// Example component that uses BindText with a formatted signal
const FormattedBindTextExample = () => {
  const [count, setCount] = createSignal(0);
  
  // Formatted signal that adds text and formatting to the count
  const formattedCount = () => {
    const value = count();
    if (value === 0) return 'No items';
    if (value === 1) return '1 item';
    return `${value} items`;
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Formatted BindText Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setCount(Math.max(0, count() - 1))}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          -
        </button>
        <span>{count()}</span>
        <button 
          onClick={() => setCount(count() + 1)}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          +
        </button>
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p>You have <BindText signal={formattedCount} /></p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <SimpleBindTextExample />,
};

export const ComputedSignal: Story = {
  render: () => <ComputedBindTextExample />,
};

export const FormattedSignal: Story = {
  render: () => <FormattedBindTextExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <SimpleBindTextExample />
      <div style={{ height: '20px' }} />
      <ComputedBindTextExample />
      <div style={{ height: '20px' }} />
      <FormattedBindTextExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The BindText component is a simple helper that renders the string value returned by a signal function.

\`\`\`tsx
import { BindText } from './components/BindText';
import { createSignal } from '../core/createSignal';

// Create a signal
const [name, setName] = createSignal('John Doe');

// Use BindText to display the signal value
<div>
  Hello, <BindText signal={() => name()} />!
</div>

// With a computed signal
const fullName = () => \`\${firstName()} \${lastName()}\`;
<p>Welcome, <BindText signal={fullName} /></p>

// With a formatted signal
const itemCount = () => {
  const count = items().length;
  return count === 1 ? '1 item' : \`\${count} items\`;
};
<p>You have <BindText signal={itemCount} /></p>
\`\`\`

The BindText component takes one prop:
- \`signal\`: A function that returns a string to be rendered

The component:
- Simply renders the string value returned by the signal function
- Automatically updates when the signal value changes
- Is a convenient alternative to using the signal function directly in JSX

This component is useful for:
- Binding signal values to text in the UI
- Displaying computed or formatted text that depends on signals
- Creating reactive text elements that update automatically
        `,
      },
    },
  },
};