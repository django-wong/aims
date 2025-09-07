import { useTimesheet } from '@/providers/timesheet-provider';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import axios from 'axios';
import { useTableApi } from '@/components/data-table-2';
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';

export function CoordinationOfficeApprove() {
  const timesheet = useTimesheet();
  const table = useTableApi();

  const role = useRole();
  const auth = useAuth();

  if (role === 5 || role === 6 || role === 7) {
    console.info('123123')
    return null;
  }

  if (timesheet?.assignment?.operation_org_id !== auth.org?.id) {
    console.info('12312323123');
    return null;
  }

  if (timesheet?.status !== 1) {
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
      <Button variant={'secondary'} onClick={approve} size={'sm'} className={'coordination-office-approve-button'}>
        <CheckIcon />
        Mark as Reviewed
      </Button>
    </>
  );
}
