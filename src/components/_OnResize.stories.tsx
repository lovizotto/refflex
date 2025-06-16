import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnResize } from './OnResize';
import { useState } from 'react';

const meta = {
  title: 'Components/OnResize',
  component: OnResize,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OnResize>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses OnResize
const OnResizeExample = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  return (
    <div>
      <OnResize on={(newSize) => setSize(newSize)} />
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <h3>Window Size</h3>
        <p>Width: {size.width}px</p>
        <p>Height: {size.height}px</p>
        <p><em>Try resizing your browser window!</em></p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <OnResizeExample />,
};

export const WithDescription: Story = {
  render: () => <OnResizeExample />,
  parameters: {
    docs: {
      description: {
        story: `
The OnResize component is a helper that listens for window resize events and calls a callback function with the new dimensions.

\`\`\`tsx
import { OnResize } from './components/OnResize';
import { useState } from 'react';

// Create state to store window dimensions
const [size, setSize] = useState({ width: 0, height: 0 });

// Use the OnResize component to listen for window resize events
<OnResize on={(newSize) => setSize(newSize)} />

// Display the current window size
<div>
  <p>Width: {size.width}px</p>
  <p>Height: {size.height}px</p>
</div>
\`\`\`

The OnResize component takes one prop:
- \`on\`: A callback function that receives an object with \`width\` and \`height\` properties

The component:
- Calls the callback immediately on mount with the initial window dimensions
- Calls the callback whenever the window is resized
- Cleans up the event listener when the component unmounts
- Renders nothing (returns null)
        `,
      },
    },
  },
};