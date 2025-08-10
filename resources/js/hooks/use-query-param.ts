import { useEffect, useState } from 'react';

export function useQueryParam(name: string, defaultValue?: string) {
  const [value, setValue] = useState<string>(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    return params.get(name) || defaultValue || '';
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);

      setValue(
        params.get(name) || defaultValue || ''
      );
    };

    window.addEventListener(
      'popstate', handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate', handlePopState
      );
    };
  }, [name, defaultValue]);

  const updateQueryParam = (newValue: string) => {
    const params = new URLSearchParams(window.location.search);

    if (newValue) {
      params.set(name, newValue);
    } else {
      params.delete(name);
    }

    const query = params.toString();

    let url = `${window.location.origin}${window.location.pathname}`;

    if (query) {
      url += `?${query}`;
    }

    window.history.replaceState(window.history.state, '', `${url}${window.location.hash}`);
    setValue(newValue);
  };

  return [value, updateQueryParam] as const;
}
