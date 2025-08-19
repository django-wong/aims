import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UsePagedGetApiProps<T> {
  initialPage?: number;
  searchParams?: URLSearchParams;
  pageSize?: number;
  initialData?: T[];
}

export function usePagedGetApi<T>(endpoint: string, options?: UsePagedGetApiProps<T>) {
  const [page, setPage] = useState<number>(options?.initialPage || 1);
  const [pageSize, setPageSize] = useState<number>(options?.pageSize || 100);

  const api = useQuery<T[]>({
    staleTime: 1000 * 60, // 5 minutes
    initialData: options?.initialData,
    queryKey: [endpoint, page, pageSize, options?.searchParams?.toString() || ''],
    queryFn: async (params) => {
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set('per_page', String(params.queryKey[2]));
      url.searchParams.set('page', String(params.queryKey[1]));
      if (options?.searchParams) {
        options.searchParams.forEach((value, key) => {
          url.searchParams.append(key, value);
        });
      }
      return fetch(url, {
        signal: params.signal
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => data['data'])
    }
  });

  return {...api, page, setPage, pageSize, setPageSize};
}
