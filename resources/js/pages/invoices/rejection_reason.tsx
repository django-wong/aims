import { useInvoice } from '@/providers/invoice-provider';
import { InvoiceStatusEnum } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export function RejectionReason() {
  const invoice = useInvoice();
  if (!invoice || invoice.status !== InvoiceStatusEnum.Rejected) {
    return null;
  }

  return (
    <div className={''}>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <div>
          <AlertTitle className={'font-bold'}>Invoice was rejected</AlertTitle>
          <AlertDescription>
            Reason: {invoice.rejection_reason || 'No reason provided'}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
