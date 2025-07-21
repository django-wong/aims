import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TableCellWrapper, { computedStyle } from '@/components/ui/table-cell-wrapper';
import { BaseTableData, useTable } from '@/hooks/use-table';
import { IconChevronDown, IconLayoutColumns } from '@tabler/icons-react';
import { flexRender, Row } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderCircle, TableIcon } from 'lucide-react';
import * as React from 'react';
import { SvgBg } from '@/components/svg-bg';
import { cn } from '@/lib/utils';

interface DataTableProps<T extends BaseTableData> {
  table: ReturnType<typeof useTable<T>>;
  left?: React.ReactNode;
  right?: React.ReactNode;
  onRowClick?: (row: Row<T>) => void;
}

const TableContext = React.createContext<null | ReturnType<typeof useTable<any>>>(null);

export function useTableApi<T extends BaseTableData>() {
  return React.useContext(TableContext) as ReturnType<typeof useTable<T>>;
}

export function DataTable<T extends BaseTableData>({ table, ...props }: DataTableProps<T>) {
  return (
    <TableContext value={table}>
      <div className={'flex flex-col gap-6'}>
        <div className={'flex flex-wrap items-center justify-between gap-2'}>
          <div className={'flex flex-grow flex-wrap items-center justify-start gap-2'}>{props.left}</div>
          <div className={'flex flex-wrap items-center justify-start gap-2'}>
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
            {props.right}
          </div>
        </div>
        <div className="overflow-hidden rounded-md border relative">
          <Table
            bottom={
              <>
                {table.getRowModel().rows.length ? null : (
                  <div
                    className={'sticky left-0 min-h-[300px] flex p-8 w-full items-center justify-center overflow-hidden'}>
                    {table.initialLoaded ? (
                      <>
                        <div className={'opacity-5'}>
                          <SvgBg/>
                        </div>
                        <div className={'flex flex-col items-center justify-center gap-2 text-foreground text-center'}>
                          <TableIcon/>
                          <p className={'font-bold text-lg'}>No data founds.</p>
                          <p className={'text-muted-foreground'}>Your search did not match any data. Please try again or create new one.</p>
                        </div>
                      </>
                    ) : (
                      <span className={'inline-flex items-center gap-2 text-muted-foreground'}>
                        <LoaderCircle className={'animate-spin'}/> Loading...
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
                    <TableHead className={cn('pin-'+(header.column.getIsPinned() || 'none'), 'bg-muted')} key={header.id} style={computedStyle(header.column)}>
                      <TableCellWrapper variant={'header'} last={index === headerGroup.headers.length - 1}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCellWrapper>
                    </TableHead>
                  ))}
                </tr>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow onClick={() => props.onRowClick?.(row)} key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell className={cn('pin-'+(cell.column.getIsPinned() || 'none'), 'bg-background')} key={cell.id} style={computedStyle(cell.column)}>
                        <TableCellWrapper last={index === row.getVisibleCells().length - 1}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCellWrapper>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : null}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
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
              <div className="flex w-fit items-center justify-center text-sm font-medium">
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
        </div>
      </div>
    </TableContext>
  );
}
