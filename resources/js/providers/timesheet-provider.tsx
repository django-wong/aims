import { createContext, useContext } from 'react';
import { Timesheet } from '@/types';

export const TimesheetContext = createContext<Timesheet|null>(null);

export function useTimesheet() {
  return useContext(TimesheetContext);
}

export const TimesheetProvider = TimesheetContext.Provider;
