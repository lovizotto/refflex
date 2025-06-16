import React from 'react';
import { useSignal, useSignalValue } from '../../hooks/useSignal';
import { S } from '../../components/S';
import { Rf } from "../../Rf";

const TimerExample = () => {
  const seconds = useSignal(0);
  const isRunning = useSignal(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => isRunning.set(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          disabled={useSignalValue(isRunning)}
        >
          Start
        </button>
        <button
          onClick={() => isRunning.set(false)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          disabled={!useSignalValue(isRunning)}
        >
          Stop
        </button>
        <button
          onClick={() => seconds.set(0)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      <div className="text-2xl font-bold">
        <S>{seconds}</S>
      </div>

      <Rf.Timer
        delay={1000}
        interval={true}
        enabled={isRunning}
        do={() => seconds.set(seconds.peek() + 1)}
      />
    </div>
  );
};

export default TimerExample;