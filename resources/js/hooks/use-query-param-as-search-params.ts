import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQueryParam } from '@/hooks/use-query-param';

type UseSearchParamsReturn = [
  URLSearchParams,
  Dispatch<SetStateAction<URLSearchParams>>
];

export function useQueryParamAsSearchParams(name: string): UseSearchParamsReturn {
  const [value, setValue] = useQueryParam(name);

  const [
    searchParams, setSearchParams
  ] = useState<URLSearchParams>(new URLSearchParams(value));

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(searchParams.toString());
    }, 100);
    return () => {
      clearTimeout(timer);
    }
  }, [searchParams, setValue])

  return [
    searchParams,
    (value) => {
      if (typeof value === 'function') {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          value(newParams);
          return newParams;
        });
      } else {
        setSearchParams(new URLSearchParams(value));
      }
    }
  ];
}
