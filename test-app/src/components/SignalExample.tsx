import React from "react";
import { useSignal } from "../../hooks/useSignal";
import { S } from "../../../src/components/S";

const SignalExample = () => {
  const count = useSignal(0); // Use hook for component-local state

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => count.set(count.peek() + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Increment
      </button>
      <div className="text-lg font-medium">
        Count: <S>{count}</S>
      </div>
    </div>
  );
};

export default SignalExample;
