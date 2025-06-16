import React from 'react';
import { useSignal, useComputed } from '../../hooks/useSignal';
import { S } from '../../components/S';
import BindInput from './BindInput';

const MemoExample = () => {
  const a = useSignal(2);
  const b = useSignal(3);

  // createComputed creates a memoized, derived signal.
  const sum = useComputed(() => {
    console.log('Calculating sum...'); // This will only log when a or b changes
    return a.get() + b.get();
  });

  return (
    <div className="flex flex-col">
      <div className="flex space-x-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value A
          </label>
          <BindInput
            signal={a}
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value B
          </label>
          <BindInput
            signal={b}
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <div className="text-lg font-medium">
          Memoized Sum: <S>{sum}</S>
        </div>
      </div>
    </div>
  );
};

export default MemoExample;