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

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/assignment-inspectors',
    defaultValues: {
      assignment_id: assignment?.id,
    },
    resolver: zodResolver(schema)
  });

  function save() {
    form.submit().then(() => {
      table.reload();
    });
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      <DataTable
        left={
          <ColumnToggle/>
        }
        table={table}
        right={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                Add Inspector
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inspector to Assignment</DialogTitle>
                <DialogDescription className={'grid gap-2'}>
                  <p>Email notifiaction will be send to inspector upon assignment.</p>
                </DialogDescription>
              </DialogHeader>
              <DialogInnerContent>
                <Form {...form}>
                  <div className={'grid grid-cols-12 gap-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Inspector'} className={'col-span-6'}>
                            <InspectorSelect
                              onValueChane={() => {}}
                              onDataChange={(user) => {
                                field.onChange(user?.id || null);
                              }}
                              value={field.value}
                            />
                          </VFormField>
                        );
                      }}
                      name={'user_id'}
                    />
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Discipline'} className={'col-span-6'}>
                            <AssignmentTypeSelect onValueChane={field.onChange} value={field.value} />
                          </VFormField>
                        );
                      }}
                      name={'assignment_type_id'}
                    />

                    <div className={'col-span-12 text-sm text-muted-foreground'}>
                      <Alert>
                        <InfoIcon />
                        <div>
                          <AlertTitle>Heads up!</AlertTitle>
                          <AlertDescription>
                            Make sure you have configured the rate in Purchase Order for the Discipline you select.
                          </AlertDescription>
                        </div>
                      </Alert>
                    </div>
                  </div>
                </Form>
              </DialogInnerContent>
              <DialogFooter>
                <DialogClose>
                  <Button variant={'outline'}>Cancel</Button>
                </DialogClose>
                <Button onClick={save}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    </>
  );
}

const schema = z.object({
  assignment_id: z.number().min(1, { message: 'Assignment is required' }),
  user_id: z.number().min(1, { message: 'Inspector is required' }),
  assignment_type_id: z.number().min(1, { message: 'Discipline is required' }),
});
