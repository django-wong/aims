import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Timesheet } from '@/types';
import dayjs from 'dayjs';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function defaultHeaders(headers: Record<string, string|undefined> = {}): Record<string, string> {
  return {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    'Accept': 'application/json',
    ...headers,
  };
}

export function timesheet_range(timesheet: Pick<Timesheet, 'start' | 'end'>) {
  const start = dayjs(timesheet.start).format('DD/MM');
  const end = dayjs(timesheet.end).format('DD/MM/YYYY');
  return `${start} - ${end}`;
}


export function describe_timesheet_status(status: Timesheet['status']) {
  /**
   * 0 = draft
   * 1 = reviewing
   * 2 = approved - waiting for contract holder approval
   * 3 = contract holder approved - waiting for client approval
   * 4 = client approved - waiting for invoicing
   * 5 = invoiced
   */
  switch (status) {
    case 0:
      return 'Draft';
    case 1:
      return 'Reviewing';
    case 2:
      return 'Initial Approved - Waiting for Contract Holder Approval';
    case 3:
      return 'Contract Holder Approved - Waiting for Client Approval';
    case 4:
      return 'Client Approved - Waiting for Invoicing';
    case 5:
      return 'Invoiced';
    default:
      return 'Unknown Status';
  }
}
