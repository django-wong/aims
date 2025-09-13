import { useTimesheet } from '@/providers/timesheet-provider';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import axios from 'axios';
import { useTableApi } from '@/components/data-table-2';
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';
import { useAssignment } from '@/providers/assignment-provider';
import { RejectButton } from '@/pages/timesheets/reject-button';
import { Role, TimesheetStatus } from '@/types';

export function ContractorHolderApprove() {
  const assignment = useAssignment();
  const timesheet = useTimesheet();

  const table = useTableApi();

  const role = useRole();
  const auth = useAuth();

  if ([Role.Admin, Role.Staff, Role.PM].indexOf(role ?? -1) === -1) {
    return null;
  }

  if (assignment?.org_id !== auth.org?.id) {
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
      <Button variant={'primary'} onClick={approve} size={'sm'} className={'contractor-holder-approve-button'}>
        <CheckIcon />
        Approve
      </Button>
      <RejectButton />
    </>
  );
}
