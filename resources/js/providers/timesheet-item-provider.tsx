import { createContext, useContext } from 'react';
import { TimesheetItem } from '@/types';

export const TimesheetItemContext = createContext<TimesheetItem|null>(null);

export function useTimesheetItem(): TimesheetItem {
  const context = useContext(TimesheetItemContext);
  if (! context) {
    throw new Error('useTimesheetItem must be used within a TimesheetItemProvider');
  }
  return context;
}

export const TimesheetItemProvider = TimesheetItemContext.Provider;
