import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTimesheet } from '@/providers/timesheet-provider';
import { cn } from '@/utils/cn';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

const ISSUES = [
  ['2', 'Report inaccuracies'],
  ['3', 'Report returned/rejected by Client'],
  ['4', 'Not following instruction'],
  ['5', 'IRN inaccuracies'],
  ['6', 'IRN returned/rejected by Client'],
  ['7', 'Inter-office: incorrect / missing information sent to Inspector'],
  ['8', 'Inter-office: Coordinating office not advised of changes (dates, inspector, etc)'],
  ['9', 'Inter-office: Client / coordinating office not advised of issues'],
  ['10', 'Late response to Client/Office request/query'],
  ['11', 'Client error / info. not supplied'],
  ['12', 'Vendor error / info. not supplied'],
];

export function describeTimesheetIssue(code: string | null | number) {
  const issue = ISSUES.find(([value]) => value === String(code));
  if (!issue) {
    return 'No Issue';
  }
  return issue[1];
}

export function TimesheetIssue() {
  const [open, setOpen] = useState(false);
  const timesheet = useTimesheet();

  function setValue(value: string) {
    if (timesheet) {
      axios.put(`/api/v1/timesheets/${timesheet.id}`, {
        issue_code: value
      }).then(() => {
        router.reload();
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          {describeTimesheetIssue(timesheet?.issue_code ?? null)}
        </span>
      </PopoverTrigger>
      <PopoverContent className={'p-0 text-left'} align={'start'}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No issues found.</CommandEmpty>
            <CommandGroup>
              {ISSUES.map(([value, name], index) => {
                return (
                  <CommandItem
                    className={'flex items-center justify-between'}
                    key={index}
                    keywords={[name, value]}
                    value={value}
                    onSelect={(currentValue) => {
                      setValue(currentValue == timesheet?.issue_code ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className={'line-clamp-1'}>{value} - {name}</div>
                    <CheckIcon className={cn('mr-2 h-4 w-4', value == timesheet?.issue_code?.toString() ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
