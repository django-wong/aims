import { Model, Client } from '@/types';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { usePagedGetApi } from '@/hooks/use-get-api';

interface CreateSelectProps<T> {
  api: string
  getKeywords: (item: T) => string[];
  searchParams?: URLSearchParams;
  getItemLabel: (item: T) => string;
}

export function createSelect<T extends Model>(options: CreateSelectProps<T>) {
  return (props: SelectProps<T>) => {
    const table = usePagedGetApi<T>(options.api, {
      pageSize: 999,
      searchParams: options.searchParams
    });

    const [open, setOpen] = useState<boolean>(false);

    return (
      <SelectPopup
        getItemLabel={options.getItemLabel}
        getKeywords={options.getKeywords}
        data={table.data}
        open={open} setOpen={setOpen} {...props}
      />
    );
  }
}

export interface SelectProps<T> {
  onValueChane: (value: number) => void;
  onDataChange?: (data: T) => void;
  value: number|null;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  renderTrigger?: (data?: T) => React.ReactNode;
  canCreateNew?: boolean; // If true, show a link to create a new data if none is found
  createButton?: React.ReactNode
}

export const ClientSelect = createSelect<Client>({
  api: '/api/v1/clients',
  getKeywords: (item) => [
    item.user?.name || item.business_name,
    item.user?.email || ''
  ],
  getItemLabel: (item) => item.business_name || item.user?.name || 'Unknown Client',
  searchParams: new URLSearchParams({
    sort: 'business_name'
  }),
});

export interface SelectPopupProps<T extends Model> extends SelectProps<T> {
  data: T[];
  open: boolean;
  setOpen: (open: boolean) => void;
  getItemLabel: (item: T) => string;
  getKeywords: (item: T) => string[];
}

export function SelectPopup<T extends Model>({ open, setOpen, ...props }: SelectPopupProps<T>) {
  function renderTrigger(item?: T) {
    if (typeof props.renderTrigger === 'function') {
      return props.renderTrigger(item);
    }
    return (
      <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between font-normal', props.className)}>
        <div className={'overflow-hidden'}>
          {item ? (
            props.getItemLabel(item)
          ) : (
            <>
              <span className={'text-gray-500'}>
                {props.placeholder || ''}
              </span>
            </>
          )}
        </div>
        <ChevronsUpDown className="opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{renderTrigger(props.data.find((data) => data.id === props.value))}</PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align={'start'}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {props.data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item.id)}
                  keywords={props.getKeywords(item)}
                  onSelect={() => {
                    setOpen(false);
                    props.onValueChane(item.id);
                    props.onDataChange?.(item);
                  }}
                >
                  <span className={'line-clamp-1'}>{props.getItemLabel(item)}</span>
                  <Check className={cn('ml-auto', props.value === item.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {props.createButton && (
          <div className={'text-muted-foreground border-t px-2 py-1 text-center text-xs'}>
            Not data found?&nbsp;
            <span className={'text-foreground underline'}>{props.createButton}</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
