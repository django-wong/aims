import { useTimesheet } from '@/providers/timesheet-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export function RejectionDetails() {
  const timesheet = useTimesheet();
  if (!timesheet || !timesheet.rejected) {
    return null;
  }

  return (
    <div className={''}>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <div>
          <AlertTitle className={'font-bold'}>Timesheet & report was rejected</AlertTitle>
          <AlertDescription>
            Reason: {timesheet.rejection_reason || 'No reason provided'}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
