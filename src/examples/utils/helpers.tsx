import React from 'react';

// --- Helper to generate data ---
export const HeavyComponent = () => {
  // Simula um componente pesado renderizando muitos nós DOM.
  const items = Array.from({ length: 50 }, (_, i) => i);
  return (
    <div className="flex flex-wrap gap-1 mt-2 pl-20">
      {items.map(i => (
        <div key={i} className="w-2 h-2 bg-gray-400 rounded-sm" />
      ))}
    </div>
  );
};

// --- Helper para gerar dados ---
export const generateItems = (count: number, offset = 0) => {
  return Array.from({ length: count }, (_, i) => {
    const id = i + offset;
    // Cerca de 5% dos itens serão "pesados"
    const isHeavy = Math.random() < 0.05;
    return {
      id,
      title: `Item ${id}`,
      // Itens pesados têm uma altura maior
      height: isHeavy ? 100 + Math.floor(Math.random() * 40) : 32 + Math.floor(Math.random() * 30),
      color: `hsl(${(id * 30) % 360}, 70%, 90%)`,
      isHeavy,
    };
  });
};