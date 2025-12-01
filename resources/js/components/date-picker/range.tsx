'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { formatDate } from '@/lib/helpers';

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export default function DateRangePicker(props: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(props.value);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleApply = () => {
    if (date) {
      props.onChange?.(date);
      setDate(date);
    }
    setIsPopoverOpen(false);
  };

  const handleReset = () => {
    setDate(props.value);
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    setDate(props.value);
  }, [props.value]);

  const handleSelect = (selected: DateRange | undefined) => {
    setDate({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <span>
          {date?.from ? (
            date.to ? (
              <>
                {formatDate(date.from)} - {formatDate(date.to)}
              </>
            ) : (
              formatDate(date.from)
            )
          ) : (
            'Pick a date range'
          )}
          </span>

          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={date?.from}
          showOutsideDays={false}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
