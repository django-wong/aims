import React from 'react';

export function useRerender() {
  const [, setRerender] = React.useState(0);

  return React.useCallback(() => {
    setRerender((prev) => prev + 1);
  }, []);
}
