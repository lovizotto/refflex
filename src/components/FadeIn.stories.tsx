import type { Meta, StoryObj } from '@storybook/react-vite';
import { FadeIn } from './FadeIn';
import { useState } from 'react';

const meta = {
  title: 'Components/FadeIn',
  component: FadeIn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses FadeIn with default duration
const DefaultFadeInExample = () => {
  const [key, setKey] = useState(0);
  
  const reset = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>FadeIn Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={reset}>Reset Animation</button>
      </div>
      
      <FadeIn key={key}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>Fade In Content</h4>
          <p>This content fades in when the component mounts.</p>
          <p>The default duration is 300ms.</p>
        </div>
      </FadeIn>
    </div>
  );
};

// Example component that uses FadeIn with different durations
const DurationExample = () => {
  const [key, setKey] = useState(0);
  
  const reset = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Duration Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={reset}>Reset Animation</button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4>Fast (100ms)</h4>
          <FadeIn key={`fast-${key}`} duration={100}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e6f7ff', 
              borderRadius: '4px',
              border: '1px solid #91d5ff'
            }}>
              <p>Fast fade in (100ms)</p>
            </div>
          </FadeIn>
        </div>
        
        <div style={{ flex: 1 }}>
          <h4>Default (300ms)</h4>
          <FadeIn key={`default-${key}`}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fff1f0', 
              borderRadius: '4px',
              border: '1px solid #ffa39e'
            }}>
              <p>Default fade in (300ms)</p>
            </div>
          </FadeIn>
        </div>
        
        <div style={{ flex: 1 }}>
          <h4>Slow (1000ms)</h4>
          <FadeIn key={`slow-${key}`} duration={1000}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f6ffed', 
              borderRadius: '4px',
              border: '1px solid #b7eb8f'
            }}>
              <p>Slow fade in (1000ms)</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

// Example component that uses FadeIn with a list of items
const ListExample = () => {
  const [key, setKey] = useState(0);
  
  const reset = () => {
    setKey(prev => prev + 1);
  };
  
  const items = [
    { id: 1, title: 'Item 1', content: 'This is the first item' },
    { id: 2, title: 'Item 2', content: 'This is the second item' },
    { id: 3, title: 'Item 3', content: 'This is the third item' },
    { id: 4, title: 'Item 4', content: 'This is the fourth item' },
    { id: 5, title: 'Item 5', content: 'This is the fifth item' },
  ];
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>List Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={reset}>Reset Animation</button>
      </div>
      
      <div>
        {items.map((item, index) => (
          <FadeIn key={`${item.id}-${key}`} duration={300 + (index * 100)}>
            <div 
              style={{ 
                padding: '15px', 
                marginBottom: '10px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              <h4>{item.title}</h4>
              <p>{item.content}</p>
              <small>Fade duration: {300 + (index * 100)}ms</small>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultFadeInExample />,
};

export const DifferentDurations: Story = {
  render: () => <DurationExample />,
};

export const StaggeredList: Story = {
  render: () => <ListExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <DefaultFadeInExample />
      <div style={{ height: '20px' }} />
      <DurationExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The FadeIn component is a helper that applies a fade-in animation to its children when the component mounts.

\`\`\`tsx
import { FadeIn } from './components/FadeIn';

// Default fade-in (300ms)
<FadeIn>
  <div>This content will fade in when mounted</div>
</FadeIn>

// Custom duration
<FadeIn duration={1000}>
  <div>This content will fade in over 1 second</div>
</FadeIn>

// With a key to reset the animation
const [key, setKey] = useState(0);
const reset = () => setKey(prev => prev + 1);

<button onClick={reset}>Reset Animation</button>
<FadeIn key={key}>
  <div>This animation will reset when the key changes</div>
</FadeIn>
\`\`\`

The FadeIn component takes two props:
- \`children\`: The content to be faded in
- \`duration\`: The duration of the fade animation in milliseconds (default: 300)

The component:
- Starts with opacity 0
- Transitions to opacity 1 after a brief delay
- Uses CSS transitions for smooth animations
- Can be reset by changing the key prop

This component is useful for:
- Creating entrance animations for content
- Improving perceived performance by gradually revealing content
- Creating staggered animations when used with multiple elements
- Drawing attention to newly loaded or updated content
        `,
      },
    },
  },
};