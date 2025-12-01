import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface UsePagedGetApiProps<T> {
  initialPage?: number;
  searchParams?: URLSearchParams;
  pageSize?: number;
  initialData?: T[];
}

export function usePagedGetApi<T>(endpoint: string|null, options?: UsePagedGetApiProps<T>) {
  const [page, setPage] = useState<number>(options?.initialPage || 1);
  const [pageSize, setPageSize] = useState<number>(options?.pageSize || 100);

  const api = useQuery<T[]>({
    staleTime: 0,
    initialData: options?.initialData,
    queryKey: [endpoint, page, pageSize, options?.searchParams?.toString() || ''],
    queryFn: async (params) => {
      if (!endpoint) {
        return options?.initialData;
      }

      const url = new URL(endpoint, window.location.origin);

      url.searchParams.set('per_page', String(params.queryKey[2]));
      url.searchParams.set('page', String(params.queryKey[1]));

      if (options?.searchParams) {
        options.searchParams.forEach((value, key) => {
          url.searchParams.append(key, value);
        });
      }

      return axios.get(url.toString(), {signal: params.signal,}).then((response) => {
        return response.data['data'];
      });
    },
  });

  return { ...api, page, setPage, pageSize, setPageSize };
}
