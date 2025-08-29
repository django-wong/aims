import dayjs from 'dayjs';
import { Timesheet } from '@/types';

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
  switch (status) {
    case 0:
      return 'Draft';
    case 1:
      return 'Reviewing';
    case 2:
      return 'Waiting for Contract Holder Approval';
    case 3:
      return 'Waiting for Client Approval';
    case 4:
      return 'Client Approved';
    case 5:
      return 'Invoiced';
    default:
      return 'Unknown Status';
  }
}

export function humanFileSize(bytes: number, si=true, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}
