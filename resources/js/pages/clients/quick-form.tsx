import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverArrow } from '@radix-ui/react-popover';

interface ClientFormProps {
  trigger: React.ReactNode;
}

export function QuickClientForm(props: ClientFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{props.trigger}</PopoverTrigger>
        <PopoverContent className={'w-80'} side={'bottom'} align={'start'}>
          <PopoverArrow/>
          Are you ok?
        </PopoverContent>
    </Popover>
  );
}
