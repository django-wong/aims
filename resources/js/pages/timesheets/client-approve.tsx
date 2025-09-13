import { useTimesheet } from '@/providers/timesheet-provider';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import axios from 'axios';
import { useTableApi } from '@/components/data-table-2';
import { useIsClient } from '@/hooks/use-role';
import { TimesheetStatus } from '@/types';

export function ClientApprove() {
  const timesheet = useTimesheet();
  const table = useTableApi();
  const isClient = useIsClient();

  if (!isClient || timesheet?.status !== TimesheetStatus.Approved) {
    return null;
  }

  function approve() {
    axios.post(`/api/v1/timesheets/${timesheet!.id}/approve`).then(() => {
      if (table) {
        table.reload();
      }
    });
  }
  return (
    <>
      <Button variant={'secondary'} onClick={approve} size={'sm'} className={'client-approve-button'}>
        <CheckIcon />
        Approve
      </Button>
    </>
  );
}
