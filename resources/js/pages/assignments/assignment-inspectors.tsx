import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTable } from '@/hooks/use-table';
import { AddInspectorToAssignment } from '@/pages/assignments/add-inspector-to-assignment';
import { useAssignment } from '@/providers/assignment-provider';
import { AssignmentInspector } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import { KeySquareIcon, TrashIcon } from 'lucide-react';

export function AssignmentInspectors() {
  const assignment = useAssignment();

  const table = useTable<AssignmentInspector>('/api/v1/assignment-inspectors', {
    defaultParams: {
      assignment_id: assignment!.id.toString(),
    },
    selectable: false,
    columns: [
      {
        accessorKey: 'name',
        header: 'Inspector',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'assignment_type_name',
        header: 'Discipline',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'acked_at',
        header: 'Acked At',
        cell: ({ row }) => {
          if (!row.original.acked_at) {
            return null;
          }
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={route('assignments.pdf', {
                    id: row.original.assignment_id,
                    inspector: row.original.user_id,
                  })}
                >
                  <Badge variant={'secondary'}>{row.original.acked_at ? dayjs(row.original.acked_at).format('DD/MM/YYYY h:mm A') : 'N/A'}</Badge>
                </a>
              </TooltipTrigger>
              <TooltipContent>Click to download the signed assignment form</TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: 'hourly_rate',
        header: 'Hourly Rate',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'travel_rate',
        header: 'Travel Rate',
        cell: (info) => info.getValue(),
        size: 100000,
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <div className={'text-right'}>Actions</div>;
        },
        cell: ({ row }) => {
          return (
            <div className={'flex items-center justify-end space-x-2'}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'outline'} size={'sm'} asChild>
                    <a href={route('impersonate', { id: row.original.user_id, redirect_to: route('assignments.record', { id: row.original.assignment_id})})}>
                      <KeySquareIcon/>
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Impersonate this inspector to perform actions on their behalf.
                </TooltipContent>
              </Tooltip>
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                  axios.delete('/api/v1/assignment-inspectors/' + row.original.id).then(() => {
                    table.reload();
                  });
                }}
              >
                <TrashIcon />
              </Button>
            </div>
          );
        },
      },
    ],
  });

  return (
    <>
      <DataTable left={<ColumnToggle />} table={table} right={<AddInspectorToAssignment />} />
    </>
  );
}
