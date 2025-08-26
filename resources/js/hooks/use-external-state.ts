import { useEffect, useState } from 'react';

export function useExternalState<T>(externalState: T, setExternalState?:  React.Dispatch<React.SetStateAction<T>>): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(externalState);

  useEffect(() => {
    setState(externalState);
  }, [externalState]);

  return [state, (value) => {
    setState(value);
    if (setExternalState) {
      setExternalState(value);
    }
  }] as const;
}
