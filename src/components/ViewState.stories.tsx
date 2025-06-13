import type { Meta, StoryObj } from '@storybook/react-vite';
import { ViewState, State } from './ViewState';
import { useState } from 'react';

const meta = {
  title: 'Components/ViewState',
  component: ViewState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ViewState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example of ViewState with simple state switching
const BasicExample = () => {
  const [currentState, setCurrentState] = useState('welcome');
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>Basic ViewState Example</h3>
      <p>Current state: <strong>{currentState}</strong></p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentState('welcome')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: currentState === 'welcome' ? '#1890ff' : '#f0f0f0',
            color: currentState === 'welcome' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Welcome
        </button>
        <button 
          onClick={() => setCurrentState('about')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: currentState === 'about' ? '#1890ff' : '#f0f0f0',
            color: currentState === 'about' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          About
        </button>
        <button 
          onClick={() => setCurrentState('contact')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: currentState === 'contact' ? '#1890ff' : '#f0f0f0',
            color: currentState === 'contact' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Contact
        </button>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '4px',
        minHeight: '200px'
      }}>
        <ViewState state={() => currentState}>
          <State name="welcome">
            <div>
              <h2>Welcome!</h2>
              <p>This is the welcome screen. Click the buttons above to navigate to different states.</p>
            </div>
          </State>
          <State name="about">
            <div>
              <h2>About Us</h2>
              <p>This is the about screen. The ViewState component allows you to show different content based on the current state.</p>
            </div>
          </State>
          <State name="contact">
            <div>
              <h2>Contact Us</h2>
              <p>This is the contact screen. You can use ViewState to implement multi-state UIs without complex conditional rendering.</p>
            </div>
          </State>
        </ViewState>
      </div>
    </div>
  );
};

// Multi-step form example
const MultiStepFormExample = () => {
  const [formState, setFormState] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const goToNext = () => {
    if (formState === 'personal') setFormState('address');
    else if (formState === 'address') setFormState('payment');
    else if (formState === 'payment') setFormState('confirmation');
  };
  
  const goToPrevious = () => {
    if (formState === 'address') setFormState('personal');
    else if (formState === 'payment') setFormState('address');
    else if (formState === 'confirmation') setFormState('payment');
  };
  
  const resetForm = () => {
    setFormState('personal');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: ''
    });
  };
  
  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };
  
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px'
  };
  
  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f0f0f0',
    color: 'black'
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '600px' }}>
      <h3>Multi-Step Form Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ 
            flex: 1, 
            padding: '10px', 
            backgroundColor: formState === 'personal' ? '#1890ff' : (
              ['address', 'payment', 'confirmation'].includes(formState) ? '#52c41a' : '#f0f0f0'
            ),
            color: formState === 'personal' || ['address', 'payment', 'confirmation'].includes(formState) ? 'white' : 'black',
            textAlign: 'center',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px'
          }}>
            Personal Info
          </div>
          <div style={{ 
            flex: 1, 
            padding: '10px', 
            backgroundColor: formState === 'address' ? '#1890ff' : (
              ['payment', 'confirmation'].includes(formState) ? '#52c41a' : '#f0f0f0'
            ),
            color: formState === 'address' || ['payment', 'confirmation'].includes(formState) ? 'white' : 'black',
            textAlign: 'center'
          }}>
            Address
          </div>
          <div style={{ 
            flex: 1, 
            padding: '10px', 
            backgroundColor: formState === 'payment' ? '#1890ff' : (
              ['confirmation'].includes(formState) ? '#52c41a' : '#f0f0f0'
            ),
            color: formState === 'payment' || ['confirmation'].includes(formState) ? 'white' : 'black',
            textAlign: 'center'
          }}>
            Payment
          </div>
          <div style={{ 
            flex: 1, 
            padding: '10px', 
            backgroundColor: formState === 'confirmation' ? '#1890ff' : '#f0f0f0',
            color: formState === 'confirmation' ? 'white' : 'black',
            textAlign: 'center',
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px'
          }}>
            Confirmation
          </div>
        </div>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '4px',
        minHeight: '300px'
      }}>
        <ViewState state={() => formState}>
          <State name="personal">
            <h4>Personal Information</h4>
            <div>
              <label>First Name</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => updateFormData('firstName', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>Last Name</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => updateFormData('lastName', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>Email</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => updateFormData('email', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={goToNext} style={buttonStyle}>Next</button>
            </div>
          </State>
          
          <State name="address">
            <h4>Address Information</h4>
            <div>
              <label>Street Address</label>
              <input 
                type="text" 
                value={formData.address} 
                onChange={(e) => updateFormData('address', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>City</label>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => updateFormData('city', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>Zip Code</label>
              <input 
                type="text" 
                value={formData.zipCode} 
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={goToPrevious} style={secondaryButtonStyle}>Previous</button>
              <button onClick={goToNext} style={buttonStyle}>Next</button>
            </div>
          </State>
          
          <State name="payment">
            <h4>Payment Information</h4>
            <div>
              <label>Card Number</label>
              <input 
                type="text" 
                value={formData.cardNumber} 
                onChange={(e) => updateFormData('cardNumber', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label>Name on Card</label>
              <input 
                type="text" 
                value={formData.cardName} 
                onChange={(e) => updateFormData('cardName', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label>Expiry Date</label>
                <input 
                  type="text" 
                  value={formData.cardExpiry} 
                  onChange={(e) => updateFormData('cardExpiry', e.target.value)}
                  placeholder="MM/YY"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>CVV</label>
                <input 
                  type="text" 
                  value={formData.cardCvv} 
                  onChange={(e) => updateFormData('cardCvv', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={goToPrevious} style={secondaryButtonStyle}>Previous</button>
              <button onClick={goToNext} style={buttonStyle}>Submit</button>
            </div>
          </State>
          
          <State name="confirmation">
            <div style={{ textAlign: 'center' }}>
              <h4>Thank You!</h4>
              <p>Your form has been submitted successfully.</p>
              <div style={{ marginTop: '20px' }}>
                <h5>Summary</h5>
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Address:</strong> {formData.address}, {formData.city} {formData.zipCode}</p>
                <p><strong>Payment:</strong> Card ending in {formData.cardNumber.slice(-4)}</p>
              </div>
              <button onClick={resetForm} style={{ ...buttonStyle, marginTop: '20px' }}>Start Over</button>
            </div>
          </State>
        </ViewState>
      </div>
    </div>
  );
};

// State machine example
const StateMachineExample = () => {
  const [machineState, setMachineState] = useState('idle');
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const startProcess = () => {
    setMachineState('loading');
    setError(null);
    
    // Simulate async process
    setTimeout(() => {
      // 20% chance of error
      if (Math.random() < 0.2) {
        setMachineState('error');
        setError('Something went wrong during processing.');
      } else {
        setMachineState('success');
        setCount(prev => prev + 1);
      }
    }, 2000);
  };
  
  const reset = () => {
    setMachineState('idle');
    setError(null);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', width: '500px' }}>
      <h3>State Machine Example</h3>
      <p>This example shows how ViewState can be used to implement a simple state machine.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Current state: <strong>{machineState}</strong></p>
        <p>Process count: <strong>{count}</strong></p>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '4px',
        minHeight: '200px'
      }}>
        <ViewState state={() => machineState}>
          <State name="idle">
            <div>
              <h4>Ready to Start</h4>
              <p>Click the button below to start the process.</p>
              <button 
                onClick={startProcess}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Start Process
              </button>
            </div>
          </State>
          
          <State name="loading">
            <div>
              <h4>Processing...</h4>
              <div style={{ 
                width: '100%', 
                height: '10px', 
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                overflow: 'hidden',
                marginTop: '20px'
              }}>
                <div style={{ 
                  width: '30%', 
                  height: '100%', 
                  backgroundColor: '#1890ff',
                  borderRadius: '5px',
                  animation: 'progress 2s infinite linear'
                }} />
              </div>
              <p style={{ marginTop: '20px' }}>Please wait while we process your request...</p>
            </div>
          </State>
          
          <State name="success">
            <div>
              <h4>Success!</h4>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '4px',
                marginTop: '20px'
              }}>
                <p>The process completed successfully.</p>
              </div>
              <button 
                onClick={reset}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#52c41a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '20px'
                }}
              >
                Reset
              </button>
            </div>
          </State>
          
          <State name="error">
            <div>
              <h4>Error</h4>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#fff2f0', 
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                marginTop: '20px'
              }}>
                <p>{error || 'An unknown error occurred.'}</p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={startProcess}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}
                >
                  Retry
                </button>
                <button 
                  onClick={reset}
                  style={{ 
                    padding: '8px 16px',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </State>
        </ViewState>
      </div>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicExample />,
};

export const MultiStepForm: Story = {
  render: () => <MultiStepFormExample />,
};

export const StateMachine: Story = {
  render: () => <StateMachineExample />,
};

export const WithDescription: Story = {
  render: () => <BasicExample />,
  parameters: {
    docs: {
      description: {
        story: `
The ViewState component is a helper for conditional rendering based on a state value, making it easy to implement multi-state UIs.

\`\`\`tsx
import { ViewState, State } from './components/ViewState';
import { useState } from 'react';

// Create state to track the current view
const [currentView, setCurrentView] = useState('welcome');

// Use ViewState to render different content based on the current state
<ViewState state={() => currentView}>
  <State name="welcome">
    <h2>Welcome!</h2>
    <p>This is the welcome screen.</p>
    <button onClick={() => setCurrentView('details')}>
      Show Details
    </button>
  </State>
  
  <State name="details">
    <h2>Details</h2>
    <p>This is the details screen.</p>
    <button onClick={() => setCurrentView('welcome')}>
      Back to Welcome
    </button>
  </State>
</ViewState>
\`\`\`

The ViewState system consists of two components:

1. \`ViewState\`: The parent component that takes two props:
   - \`state\`: A function that returns a string representing the current state
   - \`children\`: State components to render based on the current state

2. \`State\`: A component that represents a specific state, taking two props:
   - \`name\`: The name of the state this component represents
   - \`children\`: The content to render when this state is active

Benefits of using ViewState:
- Cleaner code compared to multiple conditional renders
- Easier to understand and maintain complex state-based UIs
- Naturally maps to state machines and multi-step flows
- Keeps related UI states grouped together

Common use cases:
- Multi-step forms and wizards
- State machines
- Tabs and navigation
- Different application modes or views
- Any UI that needs to show different content based on state
        `,
      },
    },
  },
};