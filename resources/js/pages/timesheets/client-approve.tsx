import { useTimesheet } from '@/providers/timesheet-provider';
import { useIsClient } from '@/hooks/use-role';
import { TimesheetStatus } from '@/types';
import { RejectButton } from '@/pages/timesheets/reject-button';
import { ApproveTimesheetForm } from '@/pages/timesheets/contractor-holder-approve';

export function ClientApprove() {
  const timesheet = useTimesheet();
  const isClient = useIsClient();

  if (!isClient || timesheet?.status !== TimesheetStatus.Approved) {
    return null;
  }

  return (
    <>
      <ApproveTimesheetForm/>
      <RejectButton />
    </>
  );
}
