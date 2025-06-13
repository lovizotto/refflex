import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cond, Otherwise } from './Cond';
import { useState } from 'react';
import { createSignal } from '../core/createSignal';

const meta = {
  title: 'Components/Cond',
  component: Cond,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Cond>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Cond with useState
const CondExample = () => {
  const [isTrue, setIsTrue] = useState(true);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Cond Component Example</h3>
      <button onClick={() => setIsTrue(!isTrue)}>
        Toggle Condition ({isTrue ? 'True' : 'False'})
      </button>
      
      <div style={{ marginTop: '10px' }}>
        <Cond condition={() => isTrue}>
          <div style={{ padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            This content is shown when the condition is true.
          </div>
          
          <Otherwise>
            <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
              This content is shown when the condition is false.
            </div>
          </Otherwise>
        </Cond>
      </div>
    </div>
  );
};

// Example component that uses Cond with a signal
const CondSignalExample = () => {
  const [count, setCount] = createSignal(0);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Cond with Signal Example</h3>
      <div>
        <button onClick={() => setCount(count() + 1)}>Increment: {count()}</button>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <Cond condition={() => count() % 2 === 0}>
          <div style={{ padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            Count is even: {count()}
          </div>
          
          <Otherwise>
            <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
              Count is odd: {count()}
            </div>
          </Otherwise>
        </Cond>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <CondExample />,
};

export const WithSignal: Story = {
  render: () => <CondSignalExample />,
};

export const TrueCondition: Story = {
  render: () => (
    <Cond condition={() => true}>
      <div>This content is shown when condition is true</div>
      <Otherwise>
        <div>This content is not shown</div>
      </Otherwise>
    </Cond>
  ),
};

export const FalseCondition: Story = {
  render: () => (
    <Cond condition={() => false}>
      <div>This content is not shown</div>
      <Otherwise>
        <div>This content is shown when condition is false</div>
      </Otherwise>
    </Cond>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <CondExample />
      <div style={{ height: '20px' }} />
      <CondSignalExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Cond component is an advanced conditional rendering helper that supports if/else logic.

\`\`\`tsx
import { Cond, Otherwise } from './components/Cond';
import { useState } from 'react';

// Create state to control the condition
const [isTrue, setIsTrue] = useState(true);

// Use the Cond component for if/else rendering
<Cond condition={() => isTrue}>
  <div>This content is shown when the condition is true</div>
  
  <Otherwise>
    <div>This content is shown when the condition is false</div>
  </Otherwise>
</Cond>
\`\`\`

The Cond component takes two props:
- \`condition\`: A function that returns a boolean
- \`children\`: The content to be conditionally rendered, including an optional Otherwise component

The component:
- Returns the children before the Otherwise component if the condition is true
- Returns the children after the Otherwise component if the condition is false
- Uses trackSignal to automatically re-render when the condition changes
- Is more powerful than Show or When as it supports both if and else branches

The Otherwise component is used to mark the beginning of the "else" branch.
        `,
      },
    },
  },
};