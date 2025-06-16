import type { Meta, StoryObj } from '@storybook/react-vite';
import { Show } from './Show';
import { useState } from 'react';

const meta = {
  title: 'Components/Show',
  component: Show,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Show>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Show
const ShowExample = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Show Component Example</h3>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      
      <div style={{ marginTop: '10px' }}>
        <Show when={isVisible}>
          <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            This content is conditionally rendered.
          </div>
        </Show>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <ShowExample />,
};

export const Visible: Story = {
  render: () => (
    <Show when={true}>
      <div>Content is visible</div>
    </Show>
  ),
};

export const Hidden: Story = {
  render: () => (
    <Show when={false}>
      <div>This content will not be rendered</div>
    </Show>
  ),
};

export const WithDescription: Story = {
  render: () => <ShowExample />,
  parameters: {
    docs: {
      description: {
        story: `
The Show component is a simple helper for conditional rendering.

\`\`\`tsx
import { Show } from './components/Show';
import { useState } from 'react';

// Create state to control visibility
const [isVisible, setIsVisible] = useState(true);

// Use the Show component for conditional rendering
<Show when={isVisible}>
  <div>This content will only be rendered when isVisible is true</div>
</Show>
\`\`\`

The Show component takes two props:
- \`when\`: A boolean that determines whether the children should be rendered
- \`children\`: The content to be conditionally rendered

The component:
- Returns the children wrapped in a fragment if \`when\` is true
- Returns null if \`when\` is false
- Is a simple alternative to using ternary operators or && for conditional rendering
        `,
      },
    },
  },
};