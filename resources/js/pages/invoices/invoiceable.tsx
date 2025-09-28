import { Badge } from '@/components/ui/badge';
import { useInvoice } from '@/providers/invoice-provider';
import { HouseIcon, UserIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function Invoiceable() {
  const invoice = useInvoice();

  if (!invoice) {
    return null;
  }

  if (invoice.invoiceable_type === 'App\\Models\\Client') {
    return (
      <Badge variant={'outline'}>
        <UserIcon />
        <Link href={route('clients.edit', invoice.invoiceable_id)} className={'link'}>
          {invoice?.invoiceable?.business_name}
        </Link>
      </Badge>
    );
  }

  return (
    <Badge variant={'outline'}>
      <HouseIcon />
      {invoice?.invoiceable?.name}
    </Badge>
  );
}
