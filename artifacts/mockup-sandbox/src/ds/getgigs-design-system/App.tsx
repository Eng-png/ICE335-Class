import { useEffect, useState, type ComponentType } from 'react';

type ModuleMap = Record<string, () => Promise<Record<string, unknown>>>;

const modules = import.meta.glob('./mockups/**/*.tsx') as ModuleMap;

function resolveComponent(
  mod: Record<string, unknown>,
  name: string,
): ComponentType | undefined {
  const functions = Object.values(mod).filter(
    (value) => typeof value === 'function',
  ) as ComponentType[];

  return (
    (mod.default as ComponentType) ||
    (mod.Preview as ComponentType) ||
    (mod[name] as ComponentType) ||
    functions[functions.length - 1]
  );
}

function PreviewRenderer({
  componentPath,
}: {
  componentPath: string;
}) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadComponent() {
      const loader = modules[`./mockups/${componentPath}.tsx`];
      if (!loader) {
        setError(`No component found at ${componentPath}.tsx`);
        return;
      }

      try {
        const module = await loader();
        if (cancelled) return;
        const name = componentPath.split('/').pop() ?? '';
        const nextComponent = resolveComponent(module, name);
        if (!nextComponent) {
          setError(`No exported component found in ${componentPath}.tsx`);
          return;
        }
        setComponent(() => nextComponent);
      } catch (cause) {
        if (!cancelled) {
          setError(
            `Failed to load preview.\n${cause instanceof Error ? cause.message : String(cause)}`,
          );
        }
      }
    }

    void loadComponent();
    return () => {
      cancelled = true;
    };
  }, [componentPath]);

  if (error) {
    return (
      <pre className="p-8 font-mono text-sm text-destructive">{error}</pre>
    );
  }

  return Component ? <Component /> : null;
}

function App() {
  const [componentPath, setComponentPath] = useState(
    window.location.hash.replace(/^#\/?/, '').replace(/\/$/, ''),
  );

  useEffect(() => {
    const handleHashChange = () =>
      setComponentPath(
        window.location.hash.replace(/^#\/?/, '').replace(/\/$/, ''),
      );
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!componentPath) {
    return (
      <div className="min-h-screen bg-background p-8 text-foreground">
        <h1 className="text-xl font-semibold">GetGigs mockups</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open a component preview from the canvas.
        </p>
      </div>
    );
  }

  return <PreviewRenderer componentPath={componentPath} />;
}

export default App;