import Layout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, ExpiringCertificate } from '@/types';
import { DataTable } from '@/components/data-table-2';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '@/hooks/use-table';
import { formatDate } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Expiring Certificates',
    href: '.'
  }
];

const columns: ColumnDef<ExpiringCertificate>[] = [
  {
    header: "Inspector",
    accessorKey: "user_full_name",
    cell: ({row}) => {
      return <Link className={'link'} href={route('inspectors.edit', row.original.user_id)+'#certificates'}>{row.original.user_full_name}</Link>
    }
  },
  {
    header: 'Certificate',
    accessorKey: 'title'
  },
  {
    header: 'Type',
    accessorKey: 'certificate_type_name'
  },
  {
    header: 'Level',
    accessorKey: 'certificate_level_name'
  },
  {
    header: 'Issued At',
    accessorKey: 'issued_at',
    cell: ({row}) => {
      return formatDate(row.original.issued_at);
    }
  },
  {
    header: "Expires At",
    accessorKey: "expires_at",
    cell: ({row}) => {
      return formatDate(row.original.expires_at);
    }
  },
  {
    header: "In Days",
    accessorKey: "expiring_in_days",
    cell: ({row}) => {
      return <Badge variant={'outline'}>
        <span className={row.original.expiring_in_days > 0 ? 'text-amber-600' : 'text-red-600'}>{row.original.expiring_in_days}</span>
      </Badge> ;
    }
  }
];

export default function ExpiringCertificatesPage() {
  const table = useTable('/api/v1/reports/expiring-certificates', {
    columns
  });

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="Expiring Certificates" />
      <div className={'p-6'}>
        <DataTable table={table}/>
      </div>
    </Layout>
  );
}
