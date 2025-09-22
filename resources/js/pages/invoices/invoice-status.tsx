import { useInvoice } from '@/providers/invoice-provider';
import { Badge } from '@/components/ui/badge';
import { InvoiceStatusEnum } from '@/types';
import { cn } from '@/utils/cn';
import React from 'react';

const invoiceStatus: {
  [key in InvoiceStatusEnum]: {
    color: string;
    label: string;
    badge_variant: React.ComponentProps<typeof Badge>['variant']
  }
} = {
  [InvoiceStatusEnum.Draft]: {
    color: 'gray',
    label: 'Draft',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Sent]: {
    color: 'blue',
    label: 'Sent',
    badge_variant: 'outline',
  },
  [InvoiceStatusEnum.Paid]: {
    color: 'green',
    label: 'Paid',
    badge_variant: 'default',
  },
  [InvoiceStatusEnum.Overdue]: {
    color: 'red',
    label: 'Overdue',
    badge_variant: 'destructive',
  },
  [InvoiceStatusEnum.Cancelled]: {
    color: 'yellow',
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
    <Badge className={cn(options.label.toLowerCase())}>
      {options.label}
    </Badge>
  );
}
