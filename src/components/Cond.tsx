import React, { ReactNode, Children, isValidElement } from "react";

/**
 * Renders its children when the 'is' prop is true.
 * Used as a branch within the <Cond> component.
 */
export const When = ({
  is,
  children,
}: {
  is: boolean;
  children: ReactNode;
}) => {
  return <>{children}</>;
};

/**
 * Renders its children if no preceding <When> component in a <Cond> block has matched.
 * Acts as the final 'else' block.
 */
export const Otherwise = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

interface CondProps {
  children: ReactNode;
}

/**
 * A component that provides declarative conditional rendering, mimicking
 * an if/else-if/else control flow. It evaluates its <When> children in order
 * and renders the first one whose 'is' prop is true. If no <When> condition is
 * met, it will render the <Otherwise> child, if one is provided.
 *
 * @example
 * <Cond>
 * <When is={status() === 'loading'}>
 * <Spinner />
 * </When>
 * <When is={status() === 'error'}>
 * <ErrorMessage />
 * </When>
 * <Otherwise>
 * <DataDisplay />
 * </Otherwise>
 * </Cond>
 */
export function Cond({ children }: CondProps) {
  const childrenArray = Children.toArray(children);

  let otherwiseChild: ReactNode = null;

  for (const child of childrenArray) {
    // Skip non-element children like strings or numbers
    if (!isValidElement(child)) {
      continue;
    }

    // After the guard, 'child' is known to be a ReactElement.
    // Check for the first matching <When> condition.
    if (child.type === When) {
      // @ts-ignore
      if (child.props.is) {
        // Render its children and exit immediately.
        // @ts-ignore
        return <>{child.props.children}</>;
      }
      // If the condition is false, continue to the next child.
      continue;
    }

    // If it's not a <When>, check if it's the <Otherwise> block.
    if (child.type === Otherwise) {
      otherwiseChild = child;
    }
  }

  // If the loop finished without finding a true <When>, render the <Otherwise> child if it exists.
  // The check here is now type-safe.
  if (isValidElement(otherwiseChild)) {
    // @ts-ignore
    return <>{otherwiseChild.props.children}</>;
  }

  // If no conditions were met and no <Otherwise> was found, render nothing.
  return null;
}
