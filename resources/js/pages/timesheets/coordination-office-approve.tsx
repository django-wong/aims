import { useTimesheet } from '@/providers/timesheet-provider';
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';
import { Role, TimesheetStatus } from '@/types';
import { RejectButton } from '@/pages/timesheets/reject-button';
import { ApproveTimesheetForm } from '@/pages/timesheets/contractor-holder-approve';

export function CoordinationOfficeApprove() {
  const timesheet = useTimesheet();

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


  return (
    <>
      <ApproveTimesheetForm/>
      <RejectButton />
    </>
  );
}
