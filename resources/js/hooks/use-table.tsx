import {
  getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, PaginationState,
  SortingState,
  TableOptions,
  useReactTable
} from '@tanstack/react-table';
import { startTransition, useEffect, useReducer, useState } from 'react';
import { useSearchParams } from '@/hooks/use-search-params';
import { Checkbox } from '@/components/ui/checkbox';
import { PagedResponse } from '@/types';

type UseTableOptions<T> = Omit<TableOptions<T>, 'data' | 'getCoreRowModel' | 'getSortedRowModel' | 'columns'>
  & {
  // Override props from tanstack/react-table
  columns?: TableOptions<T>['columns'];
} & {
  // Additional props for the useTable hook
  defaultParams?: Record<string, string>;
  // Since a user can easily add search params to the URL, this function exists to filter out unwanted search params.
  filterSearchParams?: (key: string, value: string) => boolean;
  // Each table should have a unique alias if you intend to use multiple tables on the same page
  alias?: string;
  defaultData?: T[];
  selectable?: boolean;
};

export interface BaseTableData {
  id: number | string;
}

function reloadReducer(state: number) {
  return state + 1;
}

export function useTable<T extends BaseTableData>(api: string, { selectable = true, ...options }: UseTableOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<T[]>(options?.defaultData ?? []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [reload, triggerReload] = useReducer(reloadReducer, 0);
  const [params, setParams] = useState<Record<string, string>>(options?.defaultParams ?? {});
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  const columns = Array.from(options?.columns ?? []);

  if (selectable) {
    columns.unshift({
      accessorKey: 'select',
      minSize: 32,
      maxSize: 32,
      header: ({ table }) => (
        <>
          <Checkbox
            onClick={(event) => {
              table.toggleAllPageRowsSelected();
              event.stopPropagation();
            }}
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          />
        </>
      ),
      cell: ({ row }) => (
        <>
          <Checkbox onClick={(event) => event.stopPropagation()} checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
        </>
      ),
    });
  }

  function aliased(alias: string) {
    return options?.alias ? `${options.alias}_${alias}` : alias;
  }

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: parseInt(searchParams.get(aliased('page')) ?? '1') - 1,
    pageSize: parseInt(searchParams.get(aliased('pageSize')) ?? '10'),
  });

  const table = useReactTable<T>({
    initialState: {
      columnPinning: {
        right: ['actions']
      }
    },
    pageCount: totalPage,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
    columns: columns,
    data: data,
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const value = typeof updater === 'function' ? updater(pagination) : updater;
      startTransition(() => {
        setPagination(value);
        setSearchParams((params) => {
          params.set(aliased('page'), String(value.pageIndex + 1));
          params.set(aliased('pageSize'), String(value.pageSize));
          return params;
        });
      });
    },
  });

  useEffect(() => {
    const abortController = new AbortController();
    const url = new URL(api, window.location.origin);

    if (searchParams) {
      searchParams.forEach((value, key) => {
        if (typeof options?.filterSearchParams === 'function') {
          if (options.filterSearchParams(key, value)) {
            url.searchParams.set(key, value);
          }
        } else {
          url.searchParams.set(key, value);
        }
      });
    }

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    url.searchParams.set('page', String(pagination.pageIndex + 1));
    url.searchParams.set('per_page', String(pagination.pageSize));

    const fetchOptions = {
      signal: abortController.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    fetch(url, fetchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        return new Promise<PagedResponse<T>>((resolve) => {
          setTimeout(() => {
            resolve(response);
          }, 1500);
        });
      })
      .then((response) => {
        startTransition(() => {
          setTotal(response.total || 0);
          setData(Array.isArray(response.data) ? response.data : []);
          setTotalPage(response.last_page);
        });
      })
      .catch((error) => {
        startTransition(() => {
          // setData([]);
          // setTotal(0);
          // setTotalPage(1);
        });
        throw error;
      })
      .finally(() => {
        startTransition(() => {
          setInitialLoaded(true);
        });
      });

    return () => abortController.abort();
  }, [api, pagination, searchParams, sorting, reload, params]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    initialLoaded,
    ...table,
    data,
    searchParams,
    setSearchParams,
    params,
    setParams,
    sorting,
    setSorting,
    total,
    totalPage,
    reload: () => {
      startTransition(() => {
        table.setPageIndex(0);
        triggerReload();
      });
    },
  };
}
