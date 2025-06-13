// Rf.Include.tsx (melhorado com suporte a code splitting)
import { lazy, Suspense } from 'react';

export function Include({
  of,
  src,
  fallback = null,
}: {
  of?: () => React.ReactNode;
  src?: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
}) {
  if (of) return <>{of()}</>;

  if (src) {
    const LazyComponent = lazy(src);
    return (
      <Suspense fallback={fallback}>
        <LazyComponent />
      </Suspense>
    );
  }

  return null;
}
