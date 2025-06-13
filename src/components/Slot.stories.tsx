import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slot, ProvideSlots } from './Slot';
import { useState } from 'react';

const meta = {
  title: 'Components/Slot',
  component: Slot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example layout component that uses slots
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ 
      width: '600px', 
      border: '1px solid #ccc', 
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <header style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderBottom: '1px solid #ccc' 
      }}>
        <Slot name="header" />
      </header>
      
      <main style={{ padding: '20px' }}>
        <Slot name="content" />
      </main>
      
      <footer style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderTop: '1px solid #ccc',
        textAlign: 'center'
      }}>
        <Slot name="footer" />
      </footer>
    </div>
  );
};

// Basic example of using slots
const BasicExample = () => {
  return (
    <div>
      <h3>Basic Slot Example</h3>
      <p>This example shows how to use slots to compose a page layout:</p>
      
      <ProvideSlots
        slots={{
          header: <h2>Page Header</h2>,
          content: (
            <div>
              <h3>Main Content</h3>
              <p>This is the main content of the page. It's injected into the "content" slot.</p>
              <p>Slots allow for flexible component composition without prop drilling.</p>
            </div>
          ),
          footer: <p>© 2023 Slot Example</p>
        }}
      >
        <PageLayout />
      </ProvideSlots>
    </div>
  );
};

// Dynamic example with state
const DynamicExample = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [content, setContent] = useState<'home' | 'about' | 'contact'>('home');
  
  const getContent = () => {
    switch (content) {
      case 'home':
        return (
          <div>
            <h3>Home Page</h3>
            <p>Welcome to the home page. This content is dynamically injected into the "content" slot.</p>
          </div>
        );
      case 'about':
        return (
          <div>
            <h3>About Us</h3>
            <p>Learn more about our company. This content is dynamically injected into the "content" slot.</p>
          </div>
        );
      case 'contact':
        return (
          <div>
            <h3>Contact Us</h3>
            <p>Get in touch with our team. This content is dynamically injected into the "content" slot.</p>
            <form style={{ marginTop: '10px' }}>
              <div style={{ marginBottom: '10px' }}>
                <input type="text" placeholder="Your name" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <input type="email" placeholder="Your email" style={{ width: '100%', padding: '8px' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <textarea placeholder="Your message" style={{ width: '100%', padding: '8px', height: '100px' }} />
              </div>
              <button type="button" style={{ padding: '8px 16px' }}>Send Message</button>
            </form>
          </div>
        );
    }
  };
  
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  
  const navStyles = {
    display: 'flex',
    gap: '15px'
  };
  
  const navItemStyles = (isActive: boolean) => ({
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: isActive ? 'underline' : 'none'
  });
  
  const themeButtonStyles = {
    padding: '5px 10px',
    backgroundColor: theme === 'light' ? '#333' : '#fff',
    color: theme === 'light' ? '#fff' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  const layoutStyles = {
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#333' : '#fff',
    transition: 'all 0.3s ease'
  };
  
  return (
    <div>
      <h3>Dynamic Slot Example</h3>
      <p>This example shows how to use slots with dynamic content and state:</p>
      
      <ProvideSlots
        slots={{
          header: (
            <div style={headerStyles}>
              <h2>My Website</h2>
              <nav style={navStyles}>
                <span 
                  style={navItemStyles(content === 'home')}
                  onClick={() => setContent('home')}
                >
                  Home
                </span>
                <span 
                  style={navItemStyles(content === 'about')}
                  onClick={() => setContent('about')}
                >
                  About
                </span>
                <span 
                  style={navItemStyles(content === 'contact')}
                  onClick={() => setContent('contact')}
                >
                  Contact
                </span>
              </nav>
              <button 
                style={themeButtonStyles}
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          ),
          content: getContent(),
          footer: <p>© 2023 Dynamic Slot Example | Current theme: {theme}</p>
        }}
      >
        <div style={layoutStyles}>
          <PageLayout />
        </div>
      </ProvideSlots>
    </div>
  );
};

// Nested slots example
const NestedExample = () => {
  // Card component with slots
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      overflow: 'hidden',
      margin: '10px 0'
    }}>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderBottom: '1px solid #ddd' 
      }}>
        <Slot name="cardHeader" />
      </div>
      <div style={{ padding: '15px' }}>
        <Slot name="cardContent" />
      </div>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '10px', 
        borderTop: '1px solid #ddd',
        textAlign: 'right'
      }}>
        <Slot name="cardFooter" />
      </div>
    </div>
  );
  
  return (
    <div>
      <h3>Nested Slots Example</h3>
      <p>This example shows how to nest slot providers for complex component composition:</p>
      
      <ProvideSlots
        slots={{
          header: <h2>Nested Components Demo</h2>,
          content: (
            <ProvideSlots
              slots={{
                cardHeader: <h3>Product Information</h3>,
                cardContent: (
                  <div>
                    <p><strong>Name:</strong> Premium Widget</p>
                    <p><strong>Price:</strong> $99.99</p>
                    <p><strong>Description:</strong> This is a high-quality widget with amazing features.</p>
                  </div>
                ),
                cardFooter: (
                  <button style={{ padding: '5px 10px' }}>Add to Cart</button>
                )
              }}
            >
              <div>
                <p>Here's a card component with its own slots:</p>
                <Card />
                
                <p>And another card with different content:</p>
                <ProvideSlots
                  slots={{
                    cardHeader: <h3>Customer Review</h3>,
                    cardContent: (
                      <div>
                        <p>⭐⭐⭐⭐⭐</p>
                        <p>"This widget exceeded my expectations! Highly recommended."</p>
                        <p>- John Doe</p>
                      </div>
                    ),
                    cardFooter: (
                      <button style={{ padding: '5px 10px' }}>Read More Reviews</button>
                    )
                  }}
                >
                  <Card />
                </ProvideSlots>
              </div>
            </ProvideSlots>
          ),
          footer: <p>© 2023 Nested Slots Example</p>
        }}
      >
        <PageLayout />
      </ProvideSlots>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const Dynamic: Story = {
  render: () => <DynamicExample />,
};

export const Nested: Story = {
  render: () => <NestedExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <BasicExample />
      <div style={{ height: '30px' }} />
      <DynamicExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Slot component is a powerful helper for component composition that allows parent components to inject content into specific "slots" in child components.

\`\`\`tsx
import { Slot, ProvideSlots } from './components/Slot';

// Create a layout component with slots
const Layout = () => (
  <div>
    <header>
      <Slot name="header" />
    </header>
    <main>
      <Slot name="content" />
    </main>
    <footer>
      <Slot name="footer" />
    </footer>
  </div>
);

// Use the layout with provided slots
<ProvideSlots
  slots={{
    header: <h1>Page Title</h1>,
    content: <p>Main content goes here</p>,
    footer: <p>© 2023 My Website</p>
  }}
>
  <Layout />
</ProvideSlots>
\`\`\`

The Slot system consists of two components:

1. \`ProvideSlots\`: A context provider that takes two props:
   - \`slots\`: A record of named slots (key-value pairs where keys are slot names and values are React nodes)
   - \`children\`: The child components that will consume the slots

2. \`Slot\`: A component that renders the content of a named slot, taking one prop:
   - \`name\`: The name of the slot to render

Benefits of using slots:
- Enables flexible component composition
- Avoids prop drilling
- Makes components more reusable
- Allows for dynamic content injection
- Supports nested slot providers for complex component hierarchies

Common use cases:
- Page layouts with header, footer, and content areas
- Card components with customizable headers and footers
- Tabs with custom tab content
- Dialogs with custom content and actions
- Any component that needs to be customized with different content in different contexts
        `,
      },
    },
  },
};