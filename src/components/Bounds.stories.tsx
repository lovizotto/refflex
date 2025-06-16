import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Bounds } from "../components/Bounds";
import { useSignal, useSelector } from "../hooks/useSignal";
import { S } from "../components/S";

const meta = {
  title: "Components/Bounds",
  component: Bounds,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Um componente utilitário que rastreia de forma reativa as dimensões e a posição de seu elemento filho.

### Funcionalidades Principais
- **Rastreamento Reativo:** Vincula o \`DOMRect\` de um elemento (tamanho e posição) a um sinal.
- **Performático:** Usa um \`ResizeObserver\` para um monitoramento eficiente sem causar re-renderizações desnecessárias.
- **Declarativo:** Simplesmente envolva o elemento que você deseja medir.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Bounds>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Exemplo Interativo ---
const InteractiveBoundsExample = () => {
  // Um sinal para guardar as dimensões do elemento rastreado.
  const bounds = useSignal({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  // Um sinal para controlar o estilo do elemento rastreado.
  const size = useSignal(200);

  // Usa useSelector para derivar valores para exibição.
  const width = useSelector(() => Math.round(bounds.get().width));
  const height = useSelector(() => Math.round(bounds.get().height));
  const xCoord = useSelector(() => Math.round(bounds.get().x));
  const yCoord = useSelector(() => Math.round(bounds.get().y));

  // Estilo reativo para a caixa azul.
  const boxStyle = useSelector(() => ({
    width: `${size.get()}px`,
    height: "150px",
  }));

  return (
    <div className="p-5 border rounded-lg w-[500px] flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">
        Rastreador de Dimensões (Bounds)
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        O componente abaixo rastreia o tamanho e a posição da caixa azul.
      </p>

      <div className="w-full bg-gray-100 p-3 rounded-md mb-4 text-center font-mono text-sm">
        <p>
          Width: <strong className="text-blue-600">{width}px</strong>, Height:{" "}
          <strong className="text-blue-600">{height}px</strong>
        </p>
        <p className="mt-1">
          X: <strong className="text-green-600">{xCoord}px</strong>, Y:{" "}
          <strong className="text-green-600">{yCoord}px</strong>
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => size.set(size.peek() === 200 ? 300 : 200)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Alternar Tamanho
        </button>
      </div>

      <div className="w-full h-80 bg-gray-200 rounded-md flex items-center justify-center p-4">
        {/* O componente Bounds envolve o elemento que queremos medir. */}
        <Bounds bind={bounds}>
          <div
            className="bg-blue-500 rounded-lg transition-all duration-300"
            style={boxStyle}
          >
            {/* Este conteúdo não afeta a medição */}
          </div>
        </Bounds>
      </div>
    </div>
  );
};

export const Default: Story = {
  name: "Exemplo Interativo de Bounds",
  render: () => <InteractiveBoundsExample />,
  args: {
    // Estes args são placeholders para satisfazer a tipagem do TypeScript.
    bind: {
      get: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }),
      set: () => {},
      peek: () => ({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }),
      subscribe: () => () => {},
    },
    children: <div />,
  },
};
