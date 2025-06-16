import React from 'react';
import { useSignal, useComputed } from '../../hooks/useSignal';
import { S } from '../../components/S';
import Show from './Show';

const ShowExample = () => {
  const isVisible = useSignal(true);
  const buttonText = useComputed(() =>
    isVisible.get() ? 'Hide Content' : 'Show Content',
  );

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => isVisible.set(!isVisible.peek())}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        <S>{buttonText}</S>
      </button>
      <Show when={isVisible}>
        <div className="bg-gray-100 p-3 rounded text-center">
          This content is conditionally rendered.
        </div>
      </Show>
    </div>
  );
};

export default ShowExample;