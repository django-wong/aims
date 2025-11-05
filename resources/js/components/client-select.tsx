import { Model, Client } from '@/types';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/utils/cn';
import { usePagedGetApi } from '@/hooks/use-get-api';

interface CreateSelectProps<T> extends Pick<SelectPopupProps<T>, 'getItemLabel' | 'getKeywords'> {
  api: string
  searchParams?: URLSearchParams;
}

interface SelectContextProps<T> {
  api: ReturnType<typeof usePagedGetApi<T>>
  onValueChange: (value: number|null) => void;
  onDataChange?: (data: T|null) => void;
  open: boolean;
  setOpen:  React.Dispatch<React.SetStateAction<boolean>>
}

export const SelectContext = React.createContext<SelectContextProps<any>|null>(null);

export function useSelectContext<T>() {
  const context = React.useContext(SelectContext);
  if (context) {
    return context as SelectContextProps<T>;
  }
  return null;
}

export function createSelect<T extends Model>(options: CreateSelectProps<T>) {
  const defaultParams = new URLSearchParams(options.searchParams || {});

  return ({
    params,
    ...props
  }: SelectProps<T> & {
    params?: Record<string, any>;
  }) => {
    // Merge local and external params
    const searchParams = new URLSearchParams(params);
    defaultParams.forEach((value, key) => {
      searchParams.set(key, value);
    });

    // Create api
    const api = usePagedGetApi<T>(options.api, {
      pageSize: 999,
      searchParams: searchParams
    });

    const [open, setOpen] = useState<boolean>(false);
    return (
      <SelectContext value={{
        api,
        onValueChange: props.onValueChane,
        onDataChange: props.onDataChange,
        setOpen,
        open
      }}>
        <SelectPopup
          getItemLabel={options.getItemLabel}
          getKeywords={options.getKeywords}
          data={api.data || []}
          open={open}
          setOpen={setOpen}
          {...props}
        />
      </SelectContext>
    );
  };
}

export interface SelectProps<T> {
  onValueChane: (value: number|null) => void;
  onDataChange?: (data: T|null) => void;
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
  getKeywords: (item) => [item.user?.name || item.business_name, item.user?.email || ''],
  getItemLabel: (item) => `${item.business_name} (${item.code})`,
  searchParams: new URLSearchParams({
    sort: 'business_name',
  }),
});

export interface SelectPopupProps<T> extends SelectProps<T> {
  data: T[];
  open: boolean;
  setOpen: (open: boolean) => void;
  getItemLabel: (item: T) => string | React.ReactNode;
  getKeywords: (item: T) => string[];
}

export function SelectPopup<T extends Model>({
 getKeywords, open, setOpen, getItemLabel, placeholder, data, value, onValueChane, onDataChange, createButton, ...props
}: SelectPopupProps<T>) {
  function renderTrigger(item?: T) {
    if (typeof props.renderTrigger === 'function') {
      return props.renderTrigger(item);
    }
    return (
      <Button variant="outline" role="combobox" aria-expanded={open} {...props} className={cn('w-full justify-between font-normal overflow-hidden', props.className)}>
        <div className={'overflow-hidden'}>
          {item ? (
            getItemLabel(item)
          ) : (
            <>
              <span className={'text-gray-500'}>
                {placeholder || ''}
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
      <PopoverTrigger disabled={props.disabled} asChild>{renderTrigger(data.find((data) => data.id === value))}</PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align={'start'}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.id}
                  value={String(item.id)}
                  keywords={getKeywords(item)}
                  onSelect={() => {
                    if (item.id === value) {
                      onValueChane(null);
                      onDataChange?.(null);
                    } else {
                      onValueChane(item.id);
                      onDataChange?.(item);
                    }
                    setOpen(false);
                  }}
                >
                  <span className={'w-full line-clamp-1'}>{getItemLabel(item)}</span>
                  { value === item.id && (
                    <Check className={cn('ml-auto', value === item.id ? 'opacity-100' : 'opacity-0')} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {createButton && (
          <div className={'text-muted-foreground border-t px-2 py-1 text-center text-xs'}>
            Not data found?&nbsp;
            <span className={'text-foreground underline'}>{createButton}</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
