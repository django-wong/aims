import { useTimesheet } from '@/providers/timesheet-provider';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import axios from 'axios';
import { useTableApi } from '@/components/data-table-2';
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';
import { Role, TimesheetStatus } from '@/types';
import { RejectButton } from '@/pages/timesheets/reject-button';

export function CoordinationOfficeApprove() {
  const timesheet = useTimesheet();
  const table = useTableApi();

  const role = useRole();
  const auth = useAuth();

  if ([Role.Admin, Role.Staff, Role.PM].indexOf(role ?? -1) === -1) {
    return null;
  }

  if (timesheet?.assignment?.operation_org_id !== auth.org?.id) {
    return null;
  }

  if (timesheet?.status !== TimesheetStatus.Reviewing) {
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
      <Button variant={'primary'} onClick={approve} size={'sm'} className={'coordination-office-approve-button'}>
        <CheckIcon />
        Approve
      </Button>
      <RejectButton />
    </>
  );
}
