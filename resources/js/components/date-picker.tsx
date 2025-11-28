import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface SingleDatePickerProps {
  placeholder?: string;
  value?: Date | string;
  disabled?: boolean;
  onChange?: (date: Date | undefined) => void;
  calendar?: React.ComponentProps<typeof Calendar>
}

export function DatePicker({disabled, value, onChange, placeholder, ...props }: SingleDatePickerProps) {

  const date = value ? new Date(value) : undefined;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button disabled={disabled} variant={'outline'} {...props} className={'data-[empty=true]:text-muted-foreground w-full justify-start font-normal'}>
            <div className={'flex-grow flex justify-start'}>
              {date ? (
                <span className={''}>
                  {date.toLocaleDateString(navigator.language, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
              ) : (
                <span className={'text-muted-foreground'}>{placeholder || ''}</span>
              )}
            </div>
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={'w-auto p-0'}>
          <Calendar {...props.calendar} mode={'single'} defaultMonth={date} selected={date} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </>
  );
}

// ------------

interface MultipleDatePickerProps {
  placeholder?: string;
  value?: Array<Date | string>;
  onChange?: (date: Date[] | undefined) => void;
  calendar?: React.ComponentProps<typeof Calendar>
}

export function MultipleDatePicker({value, onChange, placeholder, ...props }: MultipleDatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = value ? value.map(v => new Date(v)) : undefined;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'outline'} {...props} className={'data-[empty=true]:text-muted-foreground w-full justify-start font-normal'}>
            <div className={'flex-grow flex justify-start'}>
              {selected && selected.length > 0 ? (
                <span className={''}>
                  {selected[0].toLocaleDateString(navigator.language, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                  {selected.length > 1 ? ` + ${selected.length - 1}` : ''}
                </span>
              ) : (
                <span>{placeholder || ''}</span>
              )}
            </div>
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={'w-auto p-0'}>
          <Calendar {...props.calendar} mode={'multiple'} selected={selected} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </>
  );
}


// -----------------


interface RangeDatePickerProps {
  placeholder?: string;
  value?: DateRange | null;
  onChange?: (date: DateRange | undefined) => void;
  calendar?: React.ComponentProps<typeof Calendar>
}

export function RangeDatePicker({value, onChange, placeholder, ...props }: RangeDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant={'outline'} {...props} className={'data-[empty=true]:text-muted-foreground w-full justify-start font-normal'}>
            <div className={'flex-grow flex justify-start'}>
              {value ? (
                <span className={''}>
                  {value.from?.toLocaleDateString(navigator.language, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}

                  {' - '}

                  {value.to
                    ? value.to?.toLocaleDateString(navigator.language, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : ''}
                </span>
              ) : (
                <span>{placeholder || ''}</span>
              )}
            </div>
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={'w-auto p-0'}>
          <Calendar {...props.calendar} mode={'range'} selected={value || undefined} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </>
  );
}
