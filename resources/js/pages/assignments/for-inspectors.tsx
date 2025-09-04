import { ClientSelect } from '@/components/client-select';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { ProjectSelect } from '@/components/project-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useDebouncer } from '@/hooks/use-debounced';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { AssignmentActions, breadcrumbs } from '@/pages/assignments';
import { Assignment } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { FileIcon, User2Icon } from 'lucide-react';
import { useState } from 'react';

const columns: ColumnDef<Assignment>[] = [
  // reference_number
  {
    accessorKey: 'reference_number',
    header: 'BIE reference number',
    enableColumnFilter: true,
    cell: ({ row }) => (
      <Link href={route('assignments.edit', { id: row.original.id })} className={'underline'}>
        {row.original.reference_number || `Not set`}
      </Link>
    ),
  },
  {
    accessorKey: 'assignment_inspector.assignment_type.name',
    header: 'Assignment Type',
    cell: ({ row }) => <Badge variant={'outline'}>{row.original.assignment_inspector?.assignment_type?.name ?? 'unknown'}</Badge>
  },
  // Date recorded
  {
    accessorKey: 'created_at',
    header: 'Date recorded',
    cell: ({ row }) => dayjs(row.original.created_at).format('DD/MM/YYYY'),
  },
  {
    id: 'client_id',
    accessorKey: 'client_id',
    header: 'Client',
    cell: ({ row }) => {
      return (
        <>
          <Link href={route('clients.edit', { id: row.original.project?.client_id })} className={'underline'}>
            {row.original.project?.client?.business_name}
          </Link>
        </>
      );
    },
  },
  {
    id: 'coordinator',
    accessorKey: 'coordinator',
    header: 'Coordinator',
    cell: ({ row }) => {
      return (row.original.operation_coordinator || row.original.coordinator)?.name ?? 'N/A';
    },
  },
  {
    id: 'project_id',
    accessorKey: 'project_id',
    header: 'Project',
    cell: ({ row }) => {
      return (
        <>
          <Link href={route('projects.edit', { id: row.original.project_id })} className={'underline'}>
            {row.original.project?.title ?? row.original.project_id}
          </Link>
        </>
      );
    },
  },
  {
    accessorKey: 'client_po',
    header: 'Client PO',
    cell: ({ row }) => row.original.client_po ?? '-',
  },
  {
    accessorKey: 'vendor_id',
    header: 'Vendor',
    cell: ({ row }) => {
      return row.original.vendor?.name ?? '-';
    },
  },
  {
    accessorKey: 'sub_vendor_id',
    header: 'Sub Vendor',
    cell: ({ row }) => {
      return row.original.sub_vendor?.name ?? '-';
    },
  },
  {
    accessorKey: 'skill_id',
    header: 'Equipment Category',
    cell: ({ row }) => row.original.skill?.name ?? '-',
  },
  {
    accessorKey: 'equipment_description',
    header: 'Equipment Description',
    cell: ({ row }) => row.original.equipment ?? '-',
  },
  {
    accessorKey: 'equipment_category',
    header: 'Equipment Category',
    cell: ({ row }) => row.original.equipment_category?.name ?? '-',
  },
  // Notes
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => <div className={'line-clamp-1 max-w-[300px] text-ellipsis'}>{row.original.notes}</div>,
  },
  // budgeted hours
  {
    accessorKey: 'is_closed',
    header: 'Open / Close',
    cell: ({ row }) => <Badge variant={row.original.close_date ? 'outline' : 'default'}>{row.original.close_date ? 'Closed' : 'Open'}</Badge>,
  },
  // date closed
  {
    accessorKey: 'date_closed',
    header: 'Date Closed',
    cell: ({ row }) => (row.original.close_date ? dayjs(row.original.close_date).format('DD/MM/YYYY') : '-'),
  },

  // project type
  {
    accessorKey: 'project_type',
    header: 'Project Type',
    cell: ({ row }) => row.original.project?.project_type?.name ?? '-',
  }
];

export default function AssignmentsForInspectors() {
  const table = useTable('/api/v1/assignments', {
    selectable: false,
    columns: columns,
    initialState: {
      columnPinning: {
        left: ['reference_number'],
        right: ['actions'],
      },
      pagination: {
        pageSize: 99,
      },
    },
    defaultParams: {
      include: 'project.client,project.project_type,vendor,sub_vendor,operation_org,org,skill,assignment_inspector.assignment_type',
      sort: 'created_at'
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') ?? '');
  const debouncer = useDebouncer();

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className={'px-6'}>
          <DataTable
            table={table}
            left={
              <>
                <Input
                  value={keywords}
                  onChange={(event) => {
                    setKeywords(event.target.value);
                    debouncer(() => {
                      table.setSearchParams((params) => {
                        params.set('filter[keywords]', event.target.value);
                        return params;
                      });
                    });
                  }}
                  className={'max-w-[250px]'}
                  placeholder={'Search...'}
                />
                <ProjectSelect
                  value={Number(table.searchParams.get('filter[project_id]'))}
                  onValueChane={(value) => {
                    table.setSearchParams((params) => {
                      if (value) {
                        params.set('filter[project_id]', String(value));
                      } else {
                        params.delete('filter[project_id]');
                      }
                      return params;
                    });
                  }}
                  renderTrigger={(project) => {
                    return (
                      <Button variant={project ? 'outline' : 'dashed'}>
                        <FileIcon /> Project{project ? `: ${project.title}` : ''}
                      </Button>
                    );
                  }}
                />
                <ClientSelect
                  onValueChane={(value) => {
                    table.setSearchParams((params) => {
                      if (value) {
                        params.set('filter[client_id]', String(value));
                      } else {
                        params.delete('filter[client_id]');
                      }
                      return params;
                    });
                  }}
                  value={Number(table.searchParams.get('filter[client_id]')) || null}
                  renderTrigger={(client) => {
                    return (
                      <Button variant={client ? 'outline' : 'dashed'}>
                        <User2Icon />
                        Client{client ? `: ${client.business_name}` : ''}
                      </Button>
                    );
                  }}
                />
              </>
            }
            right={
              <>
                <ColumnToggle />
              </>
            }
          />
        </div>
      </AppLayout>
    </>
  );
}
