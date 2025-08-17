import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  calendar?: React.ComponentProps<typeof Calendar>
}

export function DatePicker({value, onChange, ...props }: DatePickerProps) {
  const date = value ? new Date(value) : undefined;
  const [open, setOpen] = useState(false);
  function setValue(value: Date | undefined) {
    setOpen(false);
    if (onChange) {
      onChange(value);
    }
  }
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'outline'} {...props} className={'data-[empty=true]:text-muted-foreground w-full justify-start font-normal'}>
            <CalendarIcon />
            {date ? (
              <span className={'ml-2'}>
                {date.toLocaleDateString(navigator.language, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={'w-auto p-0'}>
          <Calendar {...props.calendar} mode={'single'} selected={date} onSelect={setValue} />
        </PopoverContent>
      </Popover>
    </>
  );
}
