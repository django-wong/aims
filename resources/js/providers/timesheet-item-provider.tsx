import { createContext, useContext } from 'react';
import { TimesheetItem } from '@/types';

export const TimesheetItemContext = createContext<TimesheetItem|null>(null);

export function useTimesheetItem() {
  const context = useContext(TimesheetItemContext);

  if (! context) {
    return null;
  }

  return context;
}

export const TimesheetItemProvider = TimesheetItemContext.Provider;
