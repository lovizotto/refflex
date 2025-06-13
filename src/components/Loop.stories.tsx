import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Loop } from './Loop';
import { createSignal } from '../core/createSignal';

const meta = {
  title: 'Components/Loop',
  component: Loop,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    each: {
      control: false,
      description: 'The array to iterate over. Can be a plain array or a signal getter for an array.',
    },
    children: {
      control: false,
      description: 'A render function that receives `(item, index, key)` and returns a ReactNode for each item.',
    },
    keyExtractor: {
      control: false,
      description: 'Optional. A function to extract a unique `key` from each item: `(item, index) => React.Key`. Defaults to `item.id` or `index`.',
    },
  },
} satisfies Meta<typeof Loop>;

export default meta;
type Story = StoryObj<typeof Loop>;

// --- Examples ---

const StaticLoopExample = () => {
  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  return (
    <div className="p-5 border border-gray-300 rounded">
      <h3>Loop com Array Estático</h3>
      <p>
        <small>
          Exemplo de `Loop` com um array fixo. Não reage a mudanças pois a referência não muda.
        </small>
      </p>
      <ul>
        <Loop each={fruits}>
          {(fruit, index, key) => (
            <li key={key}>
              {index + 1}. {fruit}
            </li>
          )}
        </Loop>
      </ul>
    </div>
  );
};

const DynamicLoopExample = () => {
  const [items, setItems] = useState([
    { id: 'a', text: 'Item 1' },
    { id: 'b', text: 'Item 2' },
    { id: 'c', text: 'Item 3' },
  ]);
  const [newText, setNewText] = useState('');

  const addItem = () => {
    const text = newText.trim();
    if (!text) return;
    setItems(prev => [...prev, { id: String(Date.now()), text }]);
    setNewText('');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="p-5 border border-gray-300 rounded">
      <h3>Loop com Array Dinâmico (useState)</h3>
      <p>
        <small>
          Exemplo de `Loop` com `useState`. Sempre que `items` muda de
          referência, o `Loop` re-renderiza.
        </small>
      </p>
      <div>
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Novo item"
          className="mr-2"
        />
        <button onClick={addItem}>Adicionar</button>
      </div>
      <ul className="mt-2.5">
        <Loop each={items} keyExtractor={(item) => item.id}>
          {(item, _idx, key) => (
            <li key={key} className="mb-2">
              {item.text}
              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 text-xs"
              >
                Remover
              </button>
            </li>
          )}
        </Loop>
      </ul>
    </div>
  );
};

const [numbers, setNumbers] = createSignal([1, 2, 3]);
const SignalLoopExample = () => {

  const [input, setInput] = useState('');

  const addNumber = () => {
    const n = parseInt(input, 10);
    if (isNaN(n)) return;
    setNumbers([...numbers(), n]);
    setInput('');
  };

  const removeLast = () => {
    setNumbers(numbers().slice(0, -1));
  };

  return (
    <div className="p-5 border border-gray-300 rounded">
      <h3>Loop com Signal (Reativo)</h3>
      <p>
        <small>
          Exemplo de `Loop` com signal getter. Apenas o próprio `Loop` re-renderiza quando o signal muda.
        </small>
      </p>
      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Número"
          type="number"
          className="mr-2"
        />
        <button onClick={addNumber}>Adicionar</button>
        <button onClick={removeLast} className="ml-2">
          Remover Último
        </button>
      </div>
      <ul className="mt-2.5">
        <Loop each={numbers}>
          {(num, idx, key) => (
            <li key={key}>
              Número {num} (idx: {idx})
            </li>
          )}
        </Loop>
      </ul>
    </div>
  );
};

// --- Stories ---

export const Default: Story = {
  render: () => <StaticLoopExample />,
};

export const Dynamic: Story = {
  render: () => <DynamicLoopExample />,
};

export const WithSignal: Story = {
  render: () => <SignalLoopExample />,
};

export const Combined: Story = {
  render: () => (
    <>
      <StaticLoopExample />
      <div className="h-5" />
      <DynamicLoopExample />
      <div className="h-5" />
      <SignalLoopExample />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: `
O componente \`Loop\` torna a iteração declarativa e, quando recebido um signal getter, reativo.
Use \`each\` com array ou getter e \`children\` para renderizar cada item.
Defina \`keyExtractor\` para listas dinâmicas.
        `,
      },
    },
  },
};
