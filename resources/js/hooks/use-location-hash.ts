import React from 'react';

export function useLocationHash(value: string = ''): [string, (value: string) => void] {
  const [hash, setHash] = React.useState<string>(getHash());

  function getHash(): string {
    return window.location.hash.substring(1) || value;
  }

  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(getHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return [
    hash,
    (value: string) => {
      setHash(value);
      window.location.hash = value;
    }
  ];
}
