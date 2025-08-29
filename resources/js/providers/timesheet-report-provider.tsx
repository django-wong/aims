import { createContext, useContext } from 'react';
import { TimesheetReport } from '@/types';

export const TimesheetReportContext = createContext<TimesheetReport|null>(null);

export function useTimesheetReport() {
  return useContext(TimesheetReportContext);
}

export const TimesheetReportProvider = TimesheetReportContext.Provider;
