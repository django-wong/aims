import React from 'react';

function getHash(): string {
  return window.location.hash.substring(1);
}

export function useLocationHash(value: string = ''): [string, (value: string) => void] {
  const [hash, setHash] = React.useState<string>(getHash() || value);


  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(getHash() || value);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [value]);

  const location = window.location;

  return [
    hash,
    (value: string) => {
      setHash(value);
      window.history.replaceState(window.history.state, '', `${location.origin}${location.pathname}${location.search}${value ? `#${value}` : ''}`);
    }
  ];
}
