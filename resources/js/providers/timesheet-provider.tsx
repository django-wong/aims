import { createContext, useContext } from 'react';
import { Timesheet } from '@/types';

export const TimesheetContext = createContext<Timesheet|null>(null);

export function useTimesheet(): Timesheet {
  const context = useContext(TimesheetContext);
  if (! context) {
    throw new Error('useTimesheet must be used within a TimesheetProvider');
  }
  return context;
}

export const TimesheetProvider = TimesheetContext.Provider;
