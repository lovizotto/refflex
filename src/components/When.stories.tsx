import type { Meta, StoryObj } from '@storybook/react-vite';
import { When } from './When';
import { useState } from 'react';

const meta = {
  title: 'Components/When',
  component: When,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof When>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses When
const WhenExample = () => {
  const [isTrue, setIsTrue] = useState(true);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>When Component Example</h3>
      <button onClick={() => setIsTrue(!isTrue)}>
        {isTrue ? 'Set to False' : 'Set to True'}
      </button>
      
      <div style={{ marginTop: '10px' }}>
        <When truthy={isTrue}>
          <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            This content is shown when the condition is true.
          </div>
        </When>
      </div>
      
      <div style={{ marginTop: '10px' }}>
        Current value: <strong>{isTrue ? 'True' : 'False'}</strong>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <WhenExample />,
};

export const TrueCondition: Story = {
  render: () => (
    <When truthy={true}>
      <div>Content is visible when truthy is true</div>
    </When>
  ),
};

export const FalseCondition: Story = {
  render: () => (
    <When truthy={false}>
      <div>This content will not be rendered</div>
    </When>
  ),
};

export const WithDescription: Story = {
  render: () => <WhenExample />,
  parameters: {
    docs: {
      description: {
        story: `
The When component is a simple helper for conditional rendering based on a boolean value.

\`\`\`tsx
import { When } from './components/When';
import { useState } from 'react';

// Create state to control the condition
const [isTrue, setIsTrue] = useState(true);

// Use the When component for conditional rendering
<When truthy={isTrue}>
  <div>This content will only be rendered when isTrue is true</div>
</When>
\`\`\`

The When component takes two props:
- \`truthy\`: A boolean that determines whether the children should be rendered
- \`children\`: The content to be conditionally rendered

The component:
- Returns the children wrapped in a fragment if \`truthy\` is true
- Returns null if \`truthy\` is false
- Is a simple alternative to using ternary operators or && for conditional rendering
- Functions similarly to the Show component but with different prop naming

Note: This component is functionally identical to the Show component, but uses "truthy" instead of "when" for the condition prop.
        `,
      },
    },
  },
};