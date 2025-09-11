import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { computedStyle } from '@/components/ui/table-cell-wrapper';
import { BaseTableData, useTable } from '@/hooks/use-table';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
import { flexRender, Row } from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, LoaderCircle, RefreshCcwIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Empty } from '@/components/empty';
import { useDebouncer } from '@/hooks/use-debounced';

interface DataTableProps<T extends BaseTableData> {
  containerClassName?: string;
  className?: string;
  table: ReturnType<typeof useTable<T>>;
  left?: React.ReactNode;
  right?: React.ReactNode;
  head?: React.ReactNode;
  onRowClick?: (row: Row<T>) => void;
  pagination?: boolean;
}

const TableContext = React.createContext<null | ReturnType<typeof useTable<any>>>(null);

export function useTableApi<T extends BaseTableData>() {
  return React.useContext(TableContext) as ReturnType<typeof useTable<T>>;
}

export function ColumnToggle() {
  const table = useTableApi();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconLayoutColumns />
          <span className="hidden lg:inline">Customize Columns</span>
          <span className="lg:hidden">Columns</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {(typeof column.columnDef.header === 'string' ? column.columnDef.header : null) || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const tableVariants = cva(
  "overflow-hidden rounded-md border-muted relative mx-1",
  {
    variants: {
      variant: {
        default:
          "ring-muted ring-4",
        clean:
          "",
      }
    },
    defaultVariants: {
      variant: "default"
    },
  }
)

export function DataTable<T extends BaseTableData>({ variant, table, ...props }: DataTableProps<T> & VariantProps<typeof tableVariants>) {
  const showPagination = props.pagination === undefined || props.pagination;

  return (
    <TableContext value={table}>
      <div className={cn('grid grid-cols-1 gap-6', props.className)}>
        {(props.left || props.right) && (
          <div className={'flex flex-wrap items-center justify-between gap-2'}>
            <div className={'flex flex-grow flex-wrap items-center justify-start gap-2'}>{props.left}</div>
            <div className={'flex flex-wrap items-center justify-start gap-2'}>{props.right}</div>
          </div>
        )}

        {props.head}

        <div className={cn(tableVariants({ variant }), props.containerClassName)}>
          <Table
            bottom={
              <>
                {table.getRowModel().rows.length ? null : (
                  <div className={'sticky left-0 flex w-full items-center justify-center overflow-hidden p-8'}>
                    {table.initialLoaded ? (
                      <Empty>
                        <p className={'text-lg font-bold'}>No data founds.</p>
                        <p className={'text-muted-foreground'}>
                          Your search did not match any data. Please{' '}
                          <span
                            className={'cursor-pointer font-semibold underline'}
                            onClick={() => {
                              table.reload();
                            }}
                          >
                            try again
                          </span>{' '}
                          or create new one.
                        </p>
                      </Empty>
                    ) : (
                      <span className={'text-muted-foreground inline-flex items-center gap-2'}>
                        <LoaderCircle className={'animate-spin'} /> Loading...
                      </span>
                    )}
                  </div>
                )}
              </>
            }
          >
            <TableHeader className={'sticky top-0 z-10'}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      onClick={header.column.getToggleSortingHandler()}
                      key={`${index}:${header.id}`}
                      className={cn('pin-' + (header.column.getIsPinned() || 'none'), 'bg-muted border-r py-2 last:border-r-0')}
                      style={{ ...computedStyle(header.column) }}
                    >
                      <div className={'flex items-center'}>
                        <div className={'flex-grow'}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        <div className={'flex-shrink-0'}>
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="ml-1 inline-block h-4 w-4" />
                            ) : (
                              <ChevronUp className="ml-1 inline-block h-4 w-4" />
                            )
                          ) : null}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </tr>
              ))}
            </TableHeader>
            <TableBody className="hover:bg-muted **:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow onClick={() => props.onRowClick?.(row)} key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn('pin-' + (cell.column.getIsPinned() || 'none'), 'bg-background border-r last:border-r-0')}
                          style={{ ...computedStyle(cell.column) }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
        {showPagination && (
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.selectable ? (
                <>
                  {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                </>
              ) : null}
            </div>
            <div className="flex w-full items-center gap-2 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="hidden text-sm font-medium 2xl:inline">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger clearable={false} className="w-20" id="rows-per-page" size={'sm'}>
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex hidden w-fit items-center justify-center text-sm font-medium 2xl:inline">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button variant="outline" className="size-8" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <Button variant="outline" className="size-8" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TableContext>
  );
}

export function TableRefresher() {
  const debounce = useDebouncer();
  const table = useTableApi();

  return (
    <>
      <Button variant={'outline'} size={'icon'} onClick={() => debounce(() => table.reload())}>
        <RefreshCcwIcon className={table.loading ? 'animate-spin' : ''}/>
      </Button>
    </>
  );
}
