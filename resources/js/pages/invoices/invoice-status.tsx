import { useInvoice } from '@/providers/invoice-provider';
import { Badge } from '@/components/ui/badge';
import { InvoiceStatusEnum } from '@/types';
import { cn } from '@/utils/cn';
import React from 'react';

const invoiceStatus: {
  [key in InvoiceStatusEnum]: {
    className: string;
    label: string;
    badge_variant: React.ComponentProps<typeof Badge>['variant']
  }
} = {
  [InvoiceStatusEnum.Draft]: {
    className: '',
    label: 'Draft',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Sent]: {
    className: 'border-blue-300 bg-blue-50',
    label: 'Wait for Approval',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Rejected]: {
    className: 'border-amber-300 bg-amber-50',
    label: 'Rejected',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Approved]: {
    className: 'border-blue-300 bg-blue-50',
    label: 'Approved',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Paid]: {
    className: 'border-green-300 bg-green-50',
    label: 'Paid',
    badge_variant: 'default',
  },
  [InvoiceStatusEnum.Overdue]: {
    className: 'border-amber-300 bg-amber-50',
    label: 'Overdue',
    badge_variant: 'destructive',
  },
  [InvoiceStatusEnum.Cancelled]: {
    className: 'border-red-300 bg-red-50',
    label: 'Cancelled',
    badge_variant: 'outline',
  }
}

export function describeInvoiceStatus(status: InvoiceStatusEnum|null) {
  if (status === null || !invoiceStatus[status]) {
    return 'Unknown';
  }
  return invoiceStatus[status].label;
}

export function InvoiceStatus() {
  const invoice = useInvoice();

  if (!invoice || ! invoiceStatus[invoice.status]) {
    return null;
  }

  const options = invoiceStatus[invoice.status];

  return (
    <Badge variant={'outline'} className={cn(options.label.toLowerCase(), options.className)}>
      {options.label}
    </Badge>
  );
}
