'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import dayjs from 'dayjs';

interface DateTimePickerProps {
  value: Date | string | null | undefined;
  onChange: (date: Date | string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}
export default function DateTimePicker(props: DateTimePickerProps) {
  const [date, _setDate] = useState<Date | undefined>();

  // Mock time slots data
  const timeSlots = [
    { time: '09:00', available: false },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: true },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: true },
    { time: '21:00', available: true },
    { time: '21:30', available: true },
    { time: '22:00', available: true },
    { time: '22:30', available: true },
    { time: '23:00', available: true },
    { time: '23:30', available: true },
    { time: '24:00', available: true },
  ];

  const time = dayjs(props.value).format('HH:mm');

  const placeholder = props.placeholder || 'Pick a date and time';

  function setTime(selectedTime: string) {
    const target = date ?? new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const updatedDate = new Date(target);
    updatedDate.setHours(hours, minutes, 0, 0);
    setDate(updatedDate);
  }

  function setDate(selectedDate: Date) {
    _setDate(selectedDate);
    props.onChange(selectedDate.toISOString());
  }

  useEffect(() => {
    if (props.value) {
      const date = dayjs(props.value).toDate();
      if (!isNaN(date.getTime())) {
        _setDate(date);
        return;
      }
    }
    _setDate(undefined);
  }, [props.value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {
            props.children ? (props.children) : (
              <Button type="button" variant="outline" className="w-full justify-between">
                {date ? formatDateTime(date) : <span className={'text-muted-foreground'}>{placeholder}</span>}
                <CalendarIcon className={'text-muted-foreground'} />
              </Button>
            )
          }
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
              }
            }}
            className="p-2 sm:pe-5"
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">{date ? format(date, 'EEEE, d') : 'Pick a date'}</p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {timeSlots.map(({ time: timeSlot, available }) => (
                      <Button
                        key={timeSlot}
                        variant={time === timeSlot ? 'default' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={() => setTime(timeSlot)}
                        disabled={!available}
                      >
                        {timeSlot}
                      </Button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
