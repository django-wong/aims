import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { CertificateType, DialogFormProps } from '@/types';
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

export function CertificateTypes() {
  const columns: ColumnDef<CertificateType>[] = [
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
        return <CertificateTypeActions value={row.original}/>;
      }
    }
  ];

  const table = useTable<CertificateType>('/api/v1/certificate-types', {
    columns: columns
  });

  return (
    <DataTable
      left={
        <CertificateTypeForm>
          <Button>Add Certificate Type</Button>
        </CertificateTypeForm>
      }
      table={table}
      right={<ColumnToggle/>}
    />
  );
}

interface CertificateTypeActionsProps {
  value: CertificateType;
}

function CertificateTypeActions(props: CertificateTypeActionsProps) {
  const table = useTableApi();

  return (
    <div className={'flex justify-end gap-2'}>
      <CertificateTypeForm value={props.value}>
        <Button size={'sm'} variant={'outline'}>
          <PencilIcon/>
        </Button>
      </CertificateTypeForm>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure to delete this certificate type? Please make sure it\'s not used.'}
        onConfirm={() => {
          axios.delete('/api/v1/certificate-types/' + props.value.id).then((res) => {
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

function CertificateTypeForm(props: DialogFormProps) {
  const form = useReactiveForm<z.infer<typeof schema>, CertificateType>({
    ...useResource('/api/v1/certificate-types', {
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
      title={'Certificate Type'}
      description={'Add or update certificate types'}
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
