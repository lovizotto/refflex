import type { Meta, StoryObj } from '@storybook/react-vite';
import { Deferred } from './Deferred';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/Deferred',
  component: Deferred,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Deferred>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Deferred with a time delay
const TimeDelayExample = () => {
  const [resetKey, setResetKey] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const reset = () => {
    setResetKey(prev => prev + 1);
    setStartTime(Date.now());
  };
  
  const elapsedTime = currentTime - startTime;
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Deferred Time Delay Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Elapsed time: {(elapsedTime / 1000).toFixed(1)} seconds</p>
        <button onClick={reset}>Reset</button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h4>Immediate (no delay)</h4>
          <Deferred key={`immediate-${resetKey}`}>
            <div style={{ padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
              This content renders immediately
            </div>
          </Deferred>
        </div>
        
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h4>1 Second Delay</h4>
          <Deferred key={`delay1-${resetKey}`} delay={1000}>
            <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
              This content renders after 1 second
            </div>
          </Deferred>
        </div>
        
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h4>3 Second Delay</h4>
          <Deferred key={`delay3-${resetKey}`} delay={3000}>
            <div style={{ padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
              This content renders after 3 seconds
            </div>
          </Deferred>
        </div>
      </div>
    </div>
  );
};

// Example component that uses Deferred with whenInView
const ScrollExample = () => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Deferred whenInView Example</h3>
      <p>Scroll down to see content appear when it enters the viewport</p>
      
      <div style={{ height: '300px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
          ↓ Scroll down ↓
        </div>
        
        <Deferred whenInView>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e6f7ff', 
            borderRadius: '4px',
            margin: '20px',
            border: '1px solid #91d5ff'
          }}>
            <h4>First Content</h4>
            <p>This content appears when it enters the viewport</p>
          </div>
        </Deferred>
        
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
          ↓ Keep scrolling ↓
        </div>
        
        <Deferred whenInView>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff1f0', 
            borderRadius: '4px',
            margin: '20px',
            border: '1px solid #ffa39e'
          }}>
            <h4>Second Content</h4>
            <p>This content also appears when it enters the viewport</p>
          </div>
        </Deferred>
        
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
          ↓ Almost there ↓
        </div>
        
        <Deferred whenInView delay={500}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f6ffed', 
            borderRadius: '4px',
            margin: '20px',
            border: '1px solid #b7eb8f'
          }}>
            <h4>Third Content</h4>
            <p>This content appears with a 500ms delay after entering the viewport</p>
          </div>
        </Deferred>
      </div>
    </div>
  );
};

// Example component that uses Deferred for staggered loading
const StaggeredLoadingExample = () => {
  const [resetKey, setResetKey] = useState(0);
  
  const reset = () => {
    setResetKey(prev => prev + 1);
  };
  
  const items = [
    { id: 1, title: 'Item 1', delay: 0 },
    { id: 2, title: 'Item 2', delay: 200 },
    { id: 3, title: 'Item 3', delay: 400 },
    { id: 4, title: 'Item 4', delay: 600 },
    { id: 5, title: 'Item 5', delay: 800 },
    { id: 6, title: 'Item 6', delay: 1000 },
  ];
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Staggered Loading Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={reset}>Reset Animation</button>
      </div>
      
      <div>
        {items.map(item => (
          <Deferred key={`${item.id}-${resetKey}`} delay={item.delay}>
            <div 
              style={{ 
                padding: '10px', 
                marginBottom: '10px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '4px',
                animation: 'fadeInLeft 0.5s ease-out',
                border: '1px solid #ddd'
              }}
            >
              <h4>{item.title}</h4>
              <p>This item appears after a {item.delay}ms delay</p>
            </div>
          </Deferred>
        ))}
      </div>
      
      <style>
        {`
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export const TimeDelay: Story = {
  render: () => <TimeDelayExample />,
};

export const WhenInView: Story = {
  render: () => <ScrollExample />,
};

export const StaggeredLoading: Story = {
  render: () => <StaggeredLoadingExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <TimeDelayExample />
      <div style={{ height: '20px' }} />
      <StaggeredLoadingExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Deferred component is a helper that delays rendering its children until certain conditions are met.

\`\`\`tsx
import { Deferred } from './components/Deferred';

// Delay rendering for 1 second
<Deferred delay={1000}>
  <div>This content will appear after 1 second</div>
</Deferred>

// Render when the component enters the viewport
<Deferred whenInView>
  <div>This content will appear when it scrolls into view</div>
</Deferred>

// Combine both conditions
<Deferred whenInView delay={500}>
  <div>This content will appear 500ms after it scrolls into view</div>
</Deferred>
\`\`\`

The Deferred component takes three props:
- \`delay\`: The time in milliseconds to delay rendering (default: 0)
- \`whenInView\`: Whether to delay rendering until the component is in the viewport (default: false)
- \`children\`: The content to be rendered after the delay

The component:
- Renders an empty div until the conditions are met
- Uses setTimeout for time-based delays
- Uses IntersectionObserver for viewport-based delays
- Combines both conditions if both are specified

This component is useful for:
- Performance optimization by deferring non-critical content
- Creating staggered animations or loading sequences
- Implementing lazy loading for content below the fold
- Reducing initial render time for complex UIs
        `,
      },
    },
  },
};