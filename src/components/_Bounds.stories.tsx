import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bounds } from './Bounds.tsx';
import { useRef, useState } from 'react';

const meta = {
  title: 'Components/Bounds',
  component: Bounds,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Bounds>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Bounds
const BoundsExample = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const [size, setSize] = useState('medium');
  
  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
  };
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: '200px', height: '100px' };
      case 'medium':
        return { width: '300px', height: '150px' };
      case 'large':
        return { width: '400px', height: '200px' };
      default:
        return { width: '300px', height: '150px' };
    }
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Bounds Component Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => handleSizeChange('small')}
          style={{ marginRight: '10px', fontWeight: size === 'small' ? 'bold' : 'normal' }}
        >
          Small
        </button>
        <button 
          onClick={() => handleSizeChange('medium')}
          style={{ marginRight: '10px', fontWeight: size === 'medium' ? 'bold' : 'normal' }}
        >
          Medium
        </button>
        <button 
          onClick={() => handleSizeChange('large')}
          style={{ fontWeight: size === 'large' ? 'bold' : 'normal' }}
        >
          Large
        </button>
      </div>
      
      <div
        ref={containerRef}
        style={{
          ...getSizeStyle(),
          backgroundColor: '#f0f0f0',
          padding: '20px',
          borderRadius: '4px',
          transition: 'all 0.3s ease',
          position: 'relative',
        }}
      >
        <div>Resizable Container</div>
        <Bounds 
          of={containerRef} 
          onChange={(rect) => {
            setDimensions({
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              top: Math.round(rect.top),
              left: Math.round(rect.left),
            });
          }} 
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
        <h4>Element Dimensions:</h4>
        <ul>
          <li>Width: {dimensions.width}px</li>
          <li>Height: {dimensions.height}px</li>
          <li>Position Top: {dimensions.top}px</li>
          <li>Position Left: {dimensions.left}px</li>
        </ul>
      </div>
    </div>
  );
};

// Example component that uses Bounds with a resizable textarea
const ResizableTextareaExample = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Resizable Textarea Example</h3>
      <p>Resize the textarea by dragging the bottom-right corner:</p>
      
      <textarea
        ref={textareaRef}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '10px',
          borderRadius: '4px',
          resize: 'both',
        }}
        placeholder="Type something here and resize this textarea..."
      />
      
      <Bounds 
        of={textareaRef} 
        onChange={(rect) => {
          setDimensions({
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }} 
      />
      
      <div style={{ marginTop: '10px' }}>
        <p>Current dimensions: {dimensions.width}px × {dimensions.height}px</p>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <BoundsExample />,
};

export const ResizableTextarea: Story = {
  render: () => <ResizableTextareaExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BoundsExample />
      <div style={{ height: '20px' }} />
      <ResizableTextareaExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Bounds component is a helper that observes the size and position of an element and calls a callback when it changes.

\`\`\`tsx
import { Bounds } from './components/Bounds';
import { useRef, useState } from 'react';

// Create a ref for the element to observe
const elementRef = useRef<HTMLDivElement>(null);

// Create state to store the element's dimensions
const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

// Use the Bounds component to observe the element
<div ref={elementRef}>
  Observed Element
  <Bounds 
    of={elementRef} 
    onChange={(rect) => {
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    }} 
  />
</div>

// Display the dimensions
<div>
  Width: {dimensions.width}px, Height: {dimensions.height}px
</div>
\`\`\`

The Bounds component takes two props:
- \`of\`: A React ref object pointing to the element to observe
- \`onChange\`: A callback function that receives a DOMRect object with the element's dimensions and position

The component:
- Uses ResizeObserver to detect changes in the element's size
- Calls the onChange callback with the element's DOMRect when changes occur
- Returns null (renders nothing)
- Cleans up the observer when unmounted

This is useful for:
- Creating responsive layouts based on element dimensions
- Building resizable UI components
- Tracking element positions for positioning tooltips or popovers
        `,
      },
    },
  },
};