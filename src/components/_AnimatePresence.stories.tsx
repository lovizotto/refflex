import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatePresence } from './AnimatePresence';
import { useState } from 'react';

const meta = {
  title: 'Components/AnimatePresence',
  component: AnimatePresence,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimatePresence>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses AnimatePresence with a toggle button
const AnimatePresenceExample = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>AnimatePresence Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide Content' : 'Show Content'}
        </button>
      </div>
      
      <AnimatePresence show={isVisible}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>Animated Content</h4>
          <p>This content will fade in and out when the visibility changes.</p>
        </div>
      </AnimatePresence>
    </div>
  );
};

// Example component that uses AnimatePresence with different durations
const DurationExample = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [duration, setDuration] = useState(300);
  
  const durations = [100, 300, 500, 1000, 2000];
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Animation Duration Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide Content' : 'Show Content'}
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Animation Duration: {duration}ms</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {durations.map((d) => (
            <button 
              key={d} 
              onClick={() => setDuration(d)}
              style={{ 
                fontWeight: duration === d ? 'bold' : 'normal',
                padding: '5px 10px',
                backgroundColor: duration === d ? '#e6f7ff' : '#f5f5f5',
                border: '1px solid #d9d9d9',
                borderRadius: '4px'
              }}
            >
              {d}ms
            </button>
          ))}
        </div>
      </div>
      
      <AnimatePresence show={isVisible} duration={duration}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>Animated Content</h4>
          <p>This content will fade with a duration of {duration}ms.</p>
        </div>
      </AnimatePresence>
    </div>
  );
};

// Example component that uses AnimatePresence with multiple elements
const MultipleElementsExample = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  
  const tabs = [
    { id: 'tab1', label: 'Tab 1', color: '#e6f7ff' },
    { id: 'tab2', label: 'Tab 2', color: '#fff1f0' },
    { id: 'tab3', label: 'Tab 3', color: '#f6ffed' },
  ];
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Multiple Elements Example</h3>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px'
      }}>
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              padding: '5px 15px',
              backgroundColor: activeTab === tab.id ? tab.color : '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px 4px 0 0',
              borderBottom: activeTab === tab.id ? 'none' : '1px solid #d9d9d9'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div style={{ position: 'relative', minHeight: '150px' }}>
        {tabs.map((tab) => (
          <div key={tab.id} style={{ position: 'absolute', width: '100%' }}>
            <AnimatePresence show={activeTab === tab.id} duration={300}>
              <div style={{ 
                padding: '20px', 
                backgroundColor: tab.color, 
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <h4>{tab.label} Content</h4>
                <p>This is the content for {tab.label}. It will fade in when selected.</p>
              </div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <AnimatePresenceExample />,
};

export const CustomDuration: Story = {
  render: () => <DurationExample />,
};

export const TabsExample: Story = {
  render: () => <MultipleElementsExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <AnimatePresenceExample />
      <div style={{ height: '20px' }} />
      <DurationExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The AnimatePresence component is a helper that provides a fade animation when showing or hiding content.

\`\`\`tsx
import { AnimatePresence } from './components/AnimatePresence';
import { useState } from 'react';

// Create state to control visibility
const [isVisible, setIsVisible] = useState(true);

// Use AnimatePresence to animate content
<AnimatePresence show={isVisible}>
  <div>
    This content will fade in and out when isVisible changes.
  </div>
</AnimatePresence>

// With custom duration
<AnimatePresence show={isVisible} duration={500}>
  <div>
    This content will fade with a 500ms duration.
  </div>
</AnimatePresence>
\`\`\`

The AnimatePresence component takes three props:
- \`show\`: A boolean that determines whether the content should be shown
- \`children\`: The content to be shown or hidden
- \`duration\`: The duration of the fade animation in milliseconds (default: 300)

The component:
- Fades content in when \`show\` becomes true
- Fades content out when \`show\` becomes false
- Keeps the content in the DOM during the fade-out animation
- Removes the content from the DOM after the animation completes
- Uses CSS transitions for smooth animations

This component is useful for:
- Creating smooth transitions when showing or hiding content
- Building tabbed interfaces with fade transitions
- Improving user experience with animated UI elements
        `,
      },
    },
  },
};