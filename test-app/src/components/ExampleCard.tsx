import React from 'react';

// Reusable card component for examples
const ExampleCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <div className="bg-blue-500 text-white py-2 px-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="p-4 flex-grow">{children}</div>
  </div>
);

export default ExampleCard;