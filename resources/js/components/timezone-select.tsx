import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/use-api';
import { SelectProps } from '@/components/client-select';
import { Check, ChevronsUpDown } from 'lucide-react';

export function TimezoneSelect(props: SelectProps<string, string>) {
  const [open, setOpen] = useState(false);
  const api = useApi('/api/v1/timezones');
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    api.get().then((res) => {
      setData(res.data['data']);
    })
  }, [api]);

  const value = data.find((item) => item === props.value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between font-normal overflow-hidden')}>
          <div className={'overflow-hidden'}>
            {value ? (
              value
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
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align={'start'}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item}
                  value={String(item)}
                  keywords={[item]}
                  onSelect={() => {
                    if (item === value) {
                      props.onValueChane(null);
                      props.onDataChange?.(null);
                    } else {
                      props.onValueChane(item);
                      props.onDataChange?.(item);
                    }
                    setOpen(false);
                  }}
                >
                  <span className={'w-full line-clamp-1'}>{item}</span>
                  { value === item && (
                    <Check className={cn('ml-auto', value === item ? 'opacity-100' : 'opacity-0')} />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </>
  );
}
