import { usePagedGetApi } from '@/hooks/use-get-api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AssignmentInspector } from '@/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignmentInspectorSelectProps {
  assignmentId: number;
  value: number|null;
  onChange: (value: number|null) => void;
  placeholder?: string;
}

export function AssignmentInspectorSelect(props: AssignmentInspectorSelectProps) {

  const endpoint = props.assignmentId ? '/api/v1/assignments/' + props.assignmentId + '/inspectors' : null;

  const api = usePagedGetApi<AssignmentInspector>(endpoint, {
    pageSize: 999,
    initialData: []
  });

  const [open, setOpen] = useState(false);

  const selected = props.value ? api?.data?.find((item) => item.user_id == props.value) : null;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'outline'} role={'combobox'} aria-expanded={open} className={'flex w-full justify-start'}>
            {selected ? (
              <><UserIcon /> {selected.user?.name}</>
            ) : (
              <span className={'text-muted-foreground'}>{props.placeholder || 'Select inspector'}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder={'Search...'}></CommandInput>
            <CommandList>
              <CommandEmpty>No inspector available</CommandEmpty>
              <CommandGroup>
                {api.data?.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      props.onChange(props.value == item.user_id ? null : item.user_id);
                    }}>
                    {item.user?.name}
                    <Check className={cn('ml-auto', props.value === item.user_id ? 'opacity-100' : 'opacity-0')} />
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
