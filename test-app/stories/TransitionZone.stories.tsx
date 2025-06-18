import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState, useMemo } from "react";
import { TransitionZone } from "refflex";
import { Loop } from "refflex";

const meta = {
  title: "Components/TransitionZone",
  component: TransitionZone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Um componente que envolve as atualizações de seus filhos em uma Transição do React.
Isso é útil para manter a UI responsiva quando uma mudança de estado causa uma re-renderização lenta ou complexa. Ele marca a atualização como não-urgente.

### Quando Usar
Use para envolver partes da sua UI que são lentas para renderizar. Quando a prop \`children\` passada para o \`TransitionZone\` muda, ele renderizará o novo conteúdo como uma atualização não-urgente, impedindo que ele bloqueie interações mais importantes da UI (como botões ou inputs fora da zona).
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TransitionZone>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Componentes Auxiliares para a Demonstração ---

// Um componente "pesado" que simula uma renderização lenta criando muitos nós DOM.
const HeavyComponent = () => {
  const items = useMemo(
    () => Array.from({ length: 500 }, (_, i) => `Sub-item ${i}`),
    [],
  );
  return (
    <div className="p-4 bg-gray-100 border rounded-lg">
      <h4 className="font-bold mb-2">Componente Pesado</h4>
      <p className="text-xs mb-2">Este componente é lento para renderizar.</p>
      <div className="grid grid-cols-5 gap-1">
        <Loop each={items}>
          {(item) => (
            <div className="text-xs p-1 bg-gray-200 rounded-sm">{item}</div>
          )}
        </Loop>
      </div>
    </div>
  );
};

const SimpleComponent = () => (
  <div className="p-4 bg-green-100 border rounded-lg">
    <h4 className="font-bold">Componente Simples</h4>
    <p className="text-sm">Este componente renderiza instantaneamente.</p>
  </div>
);

// --- Vitrine Interativa ---
const InteractiveExample = () => {
  const [view, setView] = useState("simple");

  // O conteúdo que será renderizado é determinado pelo estado.
  const content = view === "simple" ? <SimpleComponent /> : <HeavyComponent />;

  return (
    <div className="p-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 font-sans">
      {/* --- Exemplo SEM TransitionZone --- */}
      <div className="flex flex-col p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-2 text-red-600">
          Sem TransitionZone (Lento)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Clicar neste botão causará um congelamento notável, pois o app precisa
          esperar o componente pesado renderizar.
        </p>
        <button
          onClick={() => setView((v) => (v === "simple" ? "heavy" : "simple"))}
          className="p-2 border rounded-md mb-4 bg-red-100"
        >
          Alternar Visualização
        </button>
        <div className="border rounded-md p-2 flex-grow">{content}</div>
      </div>

      {/* --- Exemplo COM TransitionZone --- */}
      <div className="flex flex-col p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="text-lg font-bold mb-2 text-green-600">
          Com TransitionZone (Responsivo)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Clicar aqui é instantâneo. A UI permanece responsiva enquanto o
          componente pesado é carregado em segundo plano.
        </p>
        <button
          onClick={() => setView((v) => (v === "heavy" ? "simple" : "heavy"))}
          className="p-2 border rounded-md mb-4 bg-green-100"
        >
          Alternar Visualização
        </button>
        <div className="border rounded-md p-2 flex-grow">
          {/* A TransitionZone recebe o novo filho (pesado) e adia sua renderização. */}
          <TransitionZone>{content}</TransitionZone>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  name: "TransitionZone Showcase",
  render: () => <InteractiveExample />,
  args: {
    children: <div />, // Argumento placeholder para o Storybook
  },
};
