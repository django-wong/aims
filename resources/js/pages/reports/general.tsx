import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/data-table-2';

import { useTable } from '@/hooks/use-table';

interface GeneralReportProps {
  title: string
  columns: [
    {
      header: string
      accessorKey: string
    }
  ]
  data: {
    [key: string]: string|number|boolean|null
  }[]
}

export default function GeneralReport(props: GeneralReportProps) {
  const breadcrumbs = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: props.title,
      href: '.',
    }
  ];

  const table = useTable<any>('', {
    columns: props.columns,
    defaultData: props.data
  })

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6">
        <DataTable
          table={table}
        />
      </div>
    </AppLayout>
  )
}
