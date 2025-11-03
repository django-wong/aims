import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { AssignmentType, DialogFormProps } from '@/types';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { z } from 'zod';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useState } from 'react';

export function Disciplines() {
  const columns: ColumnDef<AssignmentType>[] = [
    {
      accessorKey: 'name',
      header: 'Name'
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <TableCellWrapper last>Actions</TableCellWrapper>
      },
      cell: ({row}) => {
        return <DisciplineActions value={row.original}/>;
      }
    }
  ];

  const table = useTable<AssignmentType>('/api/v1/assignment-types', {
    columns: columns
  });

  return (
    <DataTable
      left={
        <DisciplineForm>
          <Button>Add Discipline</Button>
        </DisciplineForm>
      }
      table={table}
      right={<ColumnToggle/>}
    />
  );
}

interface DisciplineActionsProps {
  value: AssignmentType;
}

function DisciplineActions(props: DisciplineActionsProps) {
  const table = useTableApi();

  return (
    <div className={'flex justify-end gap-2'}>
      <DisciplineForm value={props.value}>
        <Button size={'sm'} variant={'outline'}>
          <PencilIcon/>
        </Button>
      </DisciplineForm>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure to delete this discipline? Please make sure it\'s not used.'}
        onConfirm={() => {
          axios.delete('/api/v1/assignment-types/' + props.value.id).then((res) => {
            if (res) {
              table.reload();
            }
          })
        }}
        asChild>
        <Button size={'sm'} variant={'destructive'}>
          <TrashIcon/>
        </Button>
      </PopoverConfirm>
    </div>
  );
}

const schema = z.object({
  name: z.string().min(1, 'Name is required')
})

function DisciplineForm(props: DialogFormProps) {
  const form = useReactiveForm<z.infer<typeof schema>, AssignmentType>({
    ...useResource('/api/v1/assignment-types', {
      ...props.value
    }),
    resolver: zodResolver(schema)
  });

  const table = useTableApi();

  const [open, setOpen] = useState(false);

  function submit() {
    form.submit().then((res) => {
      if (res) {
        setOpen(false);
        table.reload();
        props.onSubmit?.(res.data);
      }
    })
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={props.children}
      title={'Discipline'}
      description={'Manage discipline information'}
      footer={
        <>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button onClick={submit}>Submit</Button>
        </>
      }
    >
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-6'}>
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Name'} required className={'col-span-12'}>
                  <Input {...field}/>
                </VFormField>
              );
            }}
            name={'name'}/>
        </div>
      </Form>
    </DialogWrapper>
  );
}
