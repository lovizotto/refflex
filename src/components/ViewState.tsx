import React, { ReactNode, Children, isValidElement } from "react";
import { Signal } from "../core/signals";
import { useSelector } from "../hooks/useSignal";

/**
 * State: Um container para um bloco de UI associado a um nome de estado específico.
 * Usado dentro do ViewState.
 */
export const State = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return <>{children}</>;
};

type ViewStateProps = {
  /**
   * O estado atual. Pode ser um valor de string/número, ou um sinal que
   * contém o valor do estado.
   */
  state: string | number | Signal<string | number>;
  children: ReactNode;
  /**
   * (Opcional) Um fallback para ser renderizado se nenhum <State> correspondente for encontrado.
   */
  fallback?: ReactNode;
};

/**
 * Um componente que renderiza condicionalmente um de seus filhos <State>
 * baseado no valor da prop 'state'.
 * É otimizado para Sinais, mas funciona perfeitamente com valores de estado normais.
 */
export function ViewState({
  state: stateOrSignal,
  children,
  fallback = null,
}: ViewStateProps) {
  // O hook useSelector lida de forma inteligente tanto com sinais quanto com valores normais.
  const currentState = useSelector(() => {
    // Se for um sinal, pega seu valor. Se não, usa o valor diretamente.
    return typeof stateOrSignal === "object" && "get" in stateOrSignal
      ? stateOrSignal.get()
      : stateOrSignal;
  });

  const childrenArray = Children.toArray(children);

  for (const child of childrenArray) {
    if (
      isValidElement(child) &&
      child.type === State &&
      child.props.name === currentState
    ) {
      // Encontrou o <State> correspondente, renderiza e para.
      return <>{child.props.children}</>;
    }
  }

  // Se nenhum <State> corresponder, renderiza o fallback.
  return <>{fallback}</>;
}
