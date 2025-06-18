import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Cond, When, Otherwise } from "refflex";
import { useSignal, useSelector } from "../../src/hooks/useSignal";
import { S } from "refflex";

const meta = {
  title: "Components/Cond",
  component: Cond,
  subcomponents: { When, Otherwise },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
O componente \`Cond\` oferece uma maneira declarativa de renderizar condicionalmente a UI, imitando um bloco \`if/else if/else\`.

### Como Funciona
- **Estrutura:** Envolva suas ramificações condicionais com o componente \`<Cond>\`.
- **Condições:** Use o componente \`<When is={condicao}>\` para cada ramificação. Ele renderizará seus filhos se a prop \`is\` for verdadeira. As condições são avaliadas na ordem.
- **Fallback:** Use o componente \`<Otherwise />\` como a ramificação final (o \`else\`), que será renderizada se nenhuma condição \`<When>\` for satisfeita.
- **Reatividade:** É otimizado para sinais. Se as condições usarem sinais, apenas as partes necessárias da UI serão re-renderizadas, sem afetar o componente pai.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Cond>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Exemplo Interativo: Calculadora de Notas ---
const GradingExample = () => {
  const score = useSignal(75);

  // useSelector é usado para obter o valor reativo para a lógica condicional.
  const scoreValue = useSelector(() => score.get());

  return (
    <div className="p-5 border rounded-lg w-96">
      <h3 className="text-lg font-bold mb-2">Calculadora de Notas</h3>
      <p className="text-sm text-gray-600 mb-4">
        Mova o controle deslizante para ver a nota mudar de forma reativa.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pontuação:{" "}
          <strong className="font-mono">
            <S>{score}</S>
          </strong>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={scoreValue}
          onInput={(e) =>
            score.set(Number((e.target as HTMLInputElement).value))
          }
          className="w-full"
        />
      </div>

      <div className="p-4 rounded-lg text-center font-bold text-lg text-white">
        <Cond>
          <When is={scoreValue >= 90}>
            <div className="bg-green-500 p-3 rounded-lg">Nota: A</div>
          </When>
          <When is={scoreValue >= 80}>
            <div className="bg-blue-500 p-3 rounded-lg">Nota: B</div>
          </When>
          <When is={scoreValue >= 70}>
            <div className="bg-yellow-500 p-3 rounded-lg text-black">
              Nota: C
            </div>
          </When>
          <When is={scoreValue >= 60}>
            <div className="bg-orange-500 p-3 rounded-lg">Nota: D</div>
          </When>
          <Otherwise>
            <div className="bg-red-500 p-3 rounded-lg">Nota: F</div>
          </Otherwise>
        </Cond>
      </div>
    </div>
  );
};

export const Default: Story = {
  name: "Calculadora de Notas Reativa",
  render: () => <GradingExample />,
  args: {
    children: null, // Placeholder para o Storybook
  },
};
