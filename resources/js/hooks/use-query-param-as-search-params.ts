import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useQueryParam } from '@/hooks/use-query-param';

type UseSearchParamsReturn = [
  URLSearchParams,
  Dispatch<SetStateAction<URLSearchParams>>,
  string
];

export function useQueryParamAsSearchParams(name: string): UseSearchParamsReturn {
  const [value, setValue] = useQueryParam(name);

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(value);
  });

  return [
    searchParams,
    (value: SetStateAction<URLSearchParams>) => {
      let newValue: URLSearchParams;
      if (typeof value === 'function') {
        newValue = value(searchParams);
      } else {
        newValue = value;
      }
      setSearchParams(newValue);
      setValue(newValue.toString());
    },
    searchParams.toString()
  ];
}
