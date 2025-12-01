import { useNotificationOfInspection } from '@/providers/notification-of-inspection-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';
import { NotificationOfInspectionStatus } from '@/types';

export function NotificationOfInspectionRejectionDetails() {
  const subject = useNotificationOfInspection();
  if (!subject) {
    return null;
  }

  if (![NotificationOfInspectionStatus.Rejected, NotificationOfInspectionStatus.ClientRejected].includes(subject.status)) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle className={'font-bold'}>
        NOI was rejected
      </AlertTitle>
      <AlertDescription>
        <p>Reason: {subject.rejection_reason}</p>
        {
          subject.proposed_from ? (
            <p>Proposed From: {formatDateTime(subject.proposed_from)}</p>
          ) : null
        }
        {
          subject.proposed_to ? (
            <p>Proposed To: {formatDateTime(subject.proposed_to)}</p>
          ) : null
        }
      </AlertDescription>
    </Alert>
  );
}
