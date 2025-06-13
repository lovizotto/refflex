import type { Meta, StoryObj } from '@storybook/react-vite';
import { BindInput } from './BindInput';
import { createSignal } from '../core/createSignal';
import { useState } from 'react';

const meta = {
  title: 'Components/BindInput',
  component: BindInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BindInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses BindInput with a text input
const TextInputExample = () => {
  const [text, setText] = createSignal('');
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>BindInput Text Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Enter text:</label>
        <BindInput 
          signal={[text, setText]} 
          placeholder="Type something..." 
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Current value:</strong> {text() || '(empty)'}</p>
      </div>
    </div>
  );
};

// Example component that uses BindInput with different input types
const InputTypesExample = () => {
  const [text, setText] = createSignal('');
  const [number, setNumber] = createSignal('0');
  const [date, setDate] = createSignal('');
  const [color, setColor] = createSignal('#3366ff');
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Input Types Example</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Text:</label>
        <BindInput 
          signal={[text, setText]} 
          type="text"
          placeholder="Enter text" 
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Number:</label>
        <BindInput 
          signal={[number, setNumber]} 
          type="number"
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
        <BindInput 
          signal={[date, setDate]} 
          type="date"
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Color:</label>
        <BindInput 
          signal={[color, setColor]} 
          type="color"
          style={{ width: '100%', padding: '2px', borderRadius: '4px' }}
        />
      </div>
      
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h4>Current Values:</h4>
        <ul>
          <li><strong>Text:</strong> {text() || '(empty)'}</li>
          <li><strong>Number:</strong> {number()}</li>
          <li><strong>Date:</strong> {date() || '(not selected)'}</li>
          <li>
            <strong>Color:</strong> {color()} 
            <span style={{ 
              display: 'inline-block', 
              width: '20px', 
              height: '20px', 
              backgroundColor: color(), 
              marginLeft: '10px',
              border: '1px solid #ccc',
              verticalAlign: 'middle'
            }}></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Example component that uses BindInput with additional props
const AdditionalPropsExample = () => {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Additional Props Example</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
        <BindInput 
          signal={[username, setUsername]} 
          placeholder="Enter username"
          minLength={3}
          maxLength={20}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
        <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
          Username must be between 3 and 20 characters
        </small>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <BindInput 
          signal={[password, setPassword]} 
          type="password"
          placeholder="Enter password"
          minLength={8}
          required
          style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
        />
        <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
          Password must be at least 8 characters
        </small>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          disabled={username().length < 3 || password().length < 8}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: username().length >= 3 && password().length >= 8 ? '#1890ff' : '#d9d9d9',
            color: username().length >= 3 && password().length >= 8 ? 'white' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: username().length >= 3 && password().length >= 8 ? 'pointer' : 'not-allowed'
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <TextInputExample />,
};

export const InputTypes: Story = {
  render: () => <InputTypesExample />,
};

export const WithAdditionalProps: Story = {
  render: () => <AdditionalPropsExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <TextInputExample />
      <div style={{ height: '20px' }} />
      <InputTypesExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The BindInput component is a helper that binds a signal to an input element.

\`\`\`tsx
import { BindInput } from './components/BindInput';
import { createSignal } from '../core/createSignal';

// Create a signal for the input value
const [text, setText] = createSignal('');

// Use BindInput to bind the signal to an input element
<BindInput 
  signal={[text, setText]} 
  placeholder="Type something..." 
/>

// With additional props
<BindInput 
  signal={[text, setText]} 
  type="password"
  placeholder="Enter password"
  minLength={8}
  required
/>
\`\`\`

The BindInput component takes these props:
- \`signal\`: A tuple containing a getter and setter function for the input value
- \`...props\`: Any additional props to pass to the input element

The component:
- Creates an input element with the value bound to the signal's getter
- Updates the signal's value using the setter when the input changes
- Passes any additional props to the input element
- Simplifies creating controlled inputs that are bound to signals

This component is useful for:
- Creating form inputs that are bound to signals
- Reducing boilerplate code for handling input changes
- Building reactive forms that update automatically
        `,
      },
    },
  },
};