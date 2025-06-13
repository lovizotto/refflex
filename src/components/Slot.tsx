import { createContext, useContext } from 'react';

const SlotContext = createContext<Record<string, React.ReactNode>>({});

export function ProvideSlots({ slots, children }: {
  slots: Record<string, React.ReactNode>;
  children: React.ReactNode;
}) {
  return (
    <SlotContext.Provider value={slots}>
      {children}
    </SlotContext.Provider>
  );
}

export function Slot({ name }: { name: string }) {
  const slots = useContext(SlotContext);
  return <>{slots[name]}</>;
}
