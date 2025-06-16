import React, { createContext, useContext, ReactNode } from "react";

// The context will hold a map of slot names to their corresponding React nodes.
const SlotContext = createContext<Record<string, ReactNode>>({});

type ProvideSlotsProps = {
  /**
   * An object where keys are slot names and values are the React nodes
   * to be rendered in those slots.
   */
  slots: Record<string, ReactNode>;
  /**
   * The child components that will consume the slots. Typically, this will be a
   * single layout component that contains multiple <Slot> placeholders.
   */
  children: ReactNode;
};

/**
 * Provides named content to descendant <Slot> components. This allows a parent
 * to control the content of specific "slots" within a child's layout.
 */
export function ProvideSlots({ slots, children }: ProvideSlotsProps) {
  return <SlotContext.Provider value={slots}>{children}</SlotContext.Provider>;
}

type SlotProps = {
  /**
   * The unique name of the slot to render content from.
   */
  name: string;
  /**
   * Optional fallback content to render if the named slot is not provided
   * by a parent <ProvideSlots> component.
   */
  children?: ReactNode;
};

/**
 * Renders content for a specific slot name provided by a parent <ProvideSlots> component.
 * If no content is provided for its name, it will render its own children as a fallback.
 */
export function Slot({ name, children: fallback }: SlotProps) {
  const slots = useContext(SlotContext);
  // Render the content from the context for the given name.
  // If `slots[name]` is undefined, render the fallback content.
  return <>{slots[name] ?? fallback}</>;
}
