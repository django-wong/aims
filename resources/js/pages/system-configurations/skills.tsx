import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { Skill, DialogFormProps } from '@/types';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { CheckIcon, PencilIcon, TrashIcon } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function Skills() {
  const columns: ColumnDef<Skill>[] = [
    {
      accessorKey: 'code',
      header: 'Code'
    },
    {
      accessorKey: 'report_code',
      header: 'Report Code'
    },
    {
      accessorKey: 'i_e_a',
      header: 'I/E/A'
    },
    {
      accessorKey: 'description',
      header: 'Description'
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <TableCellWrapper last>Actions</TableCellWrapper>
      },
      cell: ({row}) => {
        return <SkillActions value={row.original}/>;
      }
    }
  ];

  const table = useTable<Skill>('/api/v1/skills', {
    columns: columns
  });

  return (
    <DataTable
      left={
        <SkillForm>
          <Button>Add Skill</Button>
        </SkillForm>
      }
      table={table}
      right={<ColumnToggle/>}
    />
  );
}

interface SkillActionsProps {
  value: Skill;
}

function SkillActions(props: SkillActionsProps) {
  const table = useTableApi();

  return (
    <div className={'flex justify-end gap-2'}>
      <SkillForm value={props.value}>
        <Button size={'sm'} variant={'outline'}>
          <PencilIcon/>
        </Button>
      </SkillForm>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure to delete this skill? Please make sure it\'s not referenced anywhere.'}
        onConfirm={() => {
          axios.delete('/api/v1/skills/' + props.value.id).then((res) => {
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
  code: z.string().min(1).max(200),
  report_code: z.string().min(1).optional().nullable(),
  i_e_a: z.string(),
  description: z.string().optional().nullable(),
  sort: z.coerce.number().optional().nullable(),
  on_skill_matrix: z.array(z.string())
})

function SkillForm(props: DialogFormProps) {
  const form = useReactiveForm<z.infer<typeof schema>, Skill>({
    ...useResource('/api/v1/skills', {
      ...props.value
    }),
    resolver: (zodResolver(schema) as any)
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
      title={'Skill'}
      description={'Add or update skill'}
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
                <VFormField label={'Code'} required className={'col-span-12'}>
                  <Input {...field}/>
                </VFormField>
              );
            }}
            name={'code'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Report Code'} className={'col-span-6'}>
                  <Input {...field} value={field.value ?? ''}/>
                </VFormField>
              );
            }}
            name={'report_code'}
          />
          <FormField
            control={form.control}
            render={({ field }) => (
              <VFormField label={'I/E/A'} className={'col-span-6'} required>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger className={'bg-background w-full'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">I</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="IE">IE</SelectItem>
                    <SelectItem value="EA">EA</SelectItem>
                    <SelectItem value="IA">IA</SelectItem>
                    <SelectItem value="IEA">IEA</SelectItem>
                  </SelectContent>
                </Select>
              </VFormField>
            )}
            name={'i_e_a'}
          />
          <FormField
            name={'on_skill_matrix'}
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'On Skill Matrix'} className={'col-span-12'}>
                  <ToggleGroup type={'multiple'} variant={'outline'} value={field.value || []} onValueChange={field.onChange}>
                    <ToggleGroupItem value={'inspection'} className={'*:opacity-15 data-[state=on]:*:opacity-100'}>
                      <CheckIcon/>
                      Inspection
                    </ToggleGroupItem>
                    <ToggleGroupItem value={'expedition'} className={'*:opacity-15 data-[state=on]:*:opacity-100'}>
                      <CheckIcon/>
                      Expedition
                    </ToggleGroupItem>
                    <ToggleGroupItem value={'specialist'} className={'*:opacity-15 data-[state=on]:*:opacity-100'}>
                      <CheckIcon/>
                      Specialist
                    </ToggleGroupItem>
                  </ToggleGroup>
                </VFormField>
              );
            }}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Description'} className={'col-span-12'}>
                  <Textarea
                    rows={5}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                  />
                </VFormField>
              );
            }}
            name={'description'}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}
