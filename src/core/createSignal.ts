// Tipo para funções que reagem a mudanças
export type Subscriber = () => void;

// Variável global usada para rastrear quem está lendo o signal
let currentTracker: Subscriber | null = null;

/**
 * Cria um signal reativo com getter e setter
 */
export function createSignal<T>(initial: T) {
  let value = initial;
  const subscribers = new Set<Subscriber>();

  const read = () => {
    // Se alguém estiver rastreando (ex: <Signal />), registramos como dependente
    if (currentTracker) subscribers.add(currentTracker);
    return value;
  };

  const write = (next: T) => {
    value = next;
    // Notifica todos os componentes/subscritores que dependem deste signal
    subscribers.forEach((fn) => fn());
  };

  return [read, write] as const;
}

/**
 * Rastreia dependências de uma função `readFn`,
 * conectando-a como dependente para ser reexecutada em mudanças.
 */
export function trackSignal(subscriber: Subscriber, readFn: () => void) {
  currentTracker = subscriber;
  readFn();
  currentTracker = null;
}