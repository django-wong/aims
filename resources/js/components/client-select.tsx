import { Client } from '@/types';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { usePagedGetApi } from '@/hooks/use-get-api';

export function ClientSelect(props: {
  onValueChane: (value: number) => void;
  onClientChange?: (client: Client) => void;
  value: number|null;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  renderTrigger?: (client?: Client) => React.ReactNode;
  canCreateNew?: boolean; // If true, show a link to create a new client if none is found
  createButton?: React.ReactNode
}) {
  const table = usePagedGetApi<Client>('api/v1/clients', {
    searchParams: new URLSearchParams({
      'fields[]': 'id,name'
    })
  });

  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<number|null>(null);

  function trigger(client?: Client) {
      return (
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {client?.name ?? <span className={'text-gray-500'}>Choose a client</span>}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {(props.renderTrigger || trigger)(table.data.find((client) => client.id === value))}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align={'start'}>
        <Command>
          <CommandInput placeholder="Search client..." className="h-9"/>
          <CommandList>
            <CommandEmpty>No client found.</CommandEmpty>
            <CommandGroup>
              {table.data.map((client) => (
                <CommandItem
                  key={client.id}
                  value={String(client.id)}
                  keywords={[
                    client.name
                  ]}
                  onSelect={() => {
                    setValue(client.id)
                    setOpen(false)
                    props.onValueChane(client.id);
                    props.onClientChange?.(client);
                  }}
                >
                  {client.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        {
          props.canCreateNew && (
            <div className={'py-1 px-2 border-t text-center text-muted-foreground text-xs'}>
              Not data found?&nbsp;
              <span className={'underline text-foreground'}>
                { props.createButton || (
                  <a target={'_blank'} href={route('clients')} >Create New</a>
                )}
              </span>
            </div>
          )
        }
      </PopoverContent>
    </Popover>
  )
}
