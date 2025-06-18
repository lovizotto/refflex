import React from "react";
import { useSignal } from "../../hooks/useSignal";
import { S } from "../../../src/components/S";
import { BindInput } from "../../../src/components/BindInput";

const BindInputExample = () => {
  const text = useSignal("");

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter text:
      </label>
      <BindInput
        signal={text}
        className="border border-gray-300 rounded px-3 py-2 mb-3"
        placeholder="Type something..."
      />
      <div className="bg-gray-100 p-3 rounded">
        <div className="text-sm text-gray-600 mb-1">You typed:</div>
        <div className="text-lg font-medium break-words">
          {/* We can use <S> for a reactive display */}
          <S>{text}</S>
        </div>
      </div>
    </div>
  );
};

export default BindInputExample;
