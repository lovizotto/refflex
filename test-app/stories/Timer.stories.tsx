import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import {
  useSignal,
  useComputed,
  useSignalValue,
} from "../../src/hooks/useSignal";
import { Timer } from "refflex";
import { S } from "refflex";
import { Loop } from "refflex";
import { Cond, When, Otherwise } from "refflex";

const meta = {
  title: "Components/Timer",
  component: Timer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The Timer is a declarative component for creating side-effects based on time.
It's optimized to be controlled by signals but is also compatible with plain boolean props.
It can be used for one-off timeouts or repeating intervals.

### Key Features
- **Declarative API:** Simply render the component to start a timer.
- **Reactive Control:** Use a signal for the \`enabled\` prop to start and stop the timer reactively without re-rendering the parent.
- **Versatile:** Supports both \`setTimeout\` (one-off) and \`setInterval\` (repeating) behavior.
- **Side-Effect Focused:** Renders no UI itself, designed purely for triggering actions.
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Interactive Memory Game Example ---

const SequenceMemoryGame = () => {
  const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const sequence = useSignal<number[]>([]);
  const gameState = useSignal<"selecting" | "playback" | "finished">(
    "selecting",
  );

  const isPlayback = useComputed(() => gameState.get() === "playback");

  const handleTileClick = (index: number) => {
    // Can only select tiles during the 'selecting' phase
    if (gameState.peek() !== "selecting" || sequence.peek().includes(index)) {
      return;
    }

    const newSequence = [...sequence.peek(), index];
    sequence.set(newSequence);

    // Start playback after 5 selections
    if (newSequence.length === 5) {
      gameState.set("playback");
    }
  };

  const handlePlaybackTick = () => {
    const currentSequence = sequence.peek();
    if (currentSequence.length > 0) {
      // Remove the last item from the sequence
      sequence.set(currentSequence.slice(0, -1));
    } else {
      // When playback is done, finish the game
      gameState.set("finished");
    }
  };

  const handleReset = () => {
    sequence.set([]);
    gameState.set("selecting");
  };

  // --- Derived State and Values ---
  // It's best practice to declare computed values before the return statement for readability.
  const isSelecting = useSignalValue(
    useComputed(() => gameState.get() === "selecting"),
  );
  const isPlaybackValue = useSignalValue(isPlayback);
  const isFinished = useSignalValue(
    useComputed(() => gameState.get() === "finished"),
  );
  const tilesRemaining = useSignalValue(
    useComputed(() => 5 - sequence.get().length),
  );
  const isNotSelecting = useSignalValue(
    useComputed(() => gameState.get() !== "selecting"),
  );

  return (
    <div className="p-5 border rounded-lg w-96 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">Sequence Memory Game</h3>

      <div className="h-12 flex items-center justify-center">
        <Cond>
          <When is={isSelecting}>
            <p className="text-sm text-gray-600">
              Select {tilesRemaining} more tiles.
            </p>
          </When>
          <When is={isPlaybackValue}>
            <p className="text-sm text-blue-600 font-semibold">
              Playing back sequence...
            </p>
          </When>
          <When is={isFinished}>
            <p className="text-sm text-green-600 font-semibold">Finished!</p>
          </When>
        </Cond>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Loop each={tiles}>
          {(tileIndex) => {
            const isSelected = useComputed(() =>
              sequence.get().includes(tileIndex),
            );
            return (
              <button
                onClick={() => handleTileClick(tileIndex)}
                className={`w-16 h-16 rounded-md transition-all duration-300
                  ${useSignalValue(isSelected) ? "bg-blue-500 scale-105" : "bg-gray-200 hover:bg-gray-300"}
                  ${isNotSelecting ? "cursor-not-allowed" : ""}
                `}
              />
            );
          }}
        </Loop>
      </div>

      <button
        onClick={handleReset}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Reset
      </button>

      {/* The Timer component drives the playback logic */}
      <Timer
        delay={500}
        interval={true}
        enabled={isPlayback}
        do={handlePlaybackTick}
      />
    </div>
  );
};

export const InteractiveGame: Story = {
  name: "Interactive Game Example",
  render: () => <SequenceMemoryGame />,
  args: {
    // Args are placeholders to satisfy Storybook's type system for the component.
    delay: 1000,
    do: () => {},
  },
};
