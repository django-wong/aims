import { useAssignment } from '@/providers/assignment-provider';
import { useTable } from '@/hooks/use-table';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { useReactiveForm } from '@/hooks/use-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { InspectorSelect } from '@/components/user-select';
import { AssignmentTypeSelect } from '@/components/assignment-type-select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { AssignmentInspector } from '@/types';
import { AddInspectorToAssignment } from '@/pages/assignments/add-inspector-to-assignment';

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
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'assignment_type_name',
        header: 'Discipline',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'hourly_rate',
        header: 'Hourly Rate',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'travel_rate',
        header: 'Travel Rate',
        cell: info => info.getValue(),
        size: 100000,
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <div className={'text-right'}>Actions</div>;
        },
        cell: ({row}) => {
          return (
            <div className={'text-right'}>
              <Button variant={'secondary'} size={'sm'} onClick={() => {
                axios.delete('/api/v1/assignment-inspectors/' + row.original.id).then(() => {
                  table.reload();
                });
              }}>
                <TrashIcon/>
              </Button>
            </div>
          );
        },
      }
    ]
  });

  return (
    <>
      <DataTable
        left={
          <ColumnToggle/>
        }
        table={table}
        right={
          <AddInspectorToAssignment/>
        }
      />
    </>
  );
}
