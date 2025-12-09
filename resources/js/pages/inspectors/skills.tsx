import { DialogFormProps, User, UserSkill } from '@/types';
import { useTable } from '@/hooks/use-table';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2Icon } from 'lucide-react';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import z from 'zod';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { SkillSelect } from '@/components/skill-select';

const user_skills_columns: ColumnDef<UserSkill>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => <span>{row.original.skill?.code}</span>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <span>{row.original.skill?.description || 'N/A'}</span>,
  },
  {
    accessorKey: 'report_code',
    header: 'Report Code',
    cell: ({ row }) => <span>{row.original.skill?.report_code || 'N/A'}</span>,
  },
  {
    accessorKey: 'i_e_a',
    header: 'I/E',
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.skill?.i_e_a}</span>;
    },
  },
  {
    accessorKey: 'Actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({ row }) => (
      <TableCellWrapper last>
        <UserSkillActions user_skill={row.original} />
      </TableCellWrapper>
    ),
  },
];

function UserSkillActions({ user_skill }: { user_skill: UserSkill }) {
  const table = useTableApi();

  return (
    <PopoverConfirm side={'bottom'} align={'end'} message={'Are you sure to delete this skill? This can not be undone.'} onConfirm={() => {
        if (confirm(`Are you sure you want to remove ${user_skill.skill?.code} from this inspector?`)) {
          axios.delete(`/api/v1/user-skills/${user_skill.id}`).then(() => {
            table.reload();
          });
        }
      }} asChild>
      <Button size={'icon'} variant={'ghost'}>
        <Trash2Icon className={'stroke-destructive'}/>
      </Button>
    </PopoverConfirm>
  );
}

interface UserSkillsProps {
  user_id: number;
}

export function UserSkills(props: UserSkillsProps) {
  const table = useTable(`/api/v1/user-skills`, {
    columns: user_skills_columns,
    defaultParams: {
      'user_id': String(props.user_id),
      'include': 'skill',
      'sort': 'code',
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');
  const debouncer = useDebouncer();

  return (
    <div>
      <DataTable
        left={
          <Input
            value={keywords}
            onChange={(event) => {
              setKeywords(event.target.value);
              debouncer(() => {
                table.setSearchParams((prev) => {
                  prev.set('filter[keywords]', event.target.value);
                  return prev;
                });
              });
            }}
            placeholder={'Search skills...'}
            className={'max-w-[250px]'}
          />
        }
        table={table}
        right={
          <UserSkillForm value={{user_id: props.user_id}} onSubmit={() => table.reload()}>
            <Button>
              <Plus/> Add Skill
            </Button>
          </UserSkillForm>
        }
      />
    </div>
  );
}

const schema = z.object({
  skill_id: z.number().min(1, 'Skill is required'),
  user_id: z.number().min(1),
});

function UserSkillForm(props: DialogFormProps<z.infer<typeof schema>, UserSkill>) {
  const form = useReactiveForm<z.infer<typeof schema>, UserSkill>({
    url: '/api/v1/user-skills',
    defaultValues: {
      user_id: props.value?.user_id
    },
    resolver: zodResolver(schema)
  });

  const [open, setOpen] = useState(false);

  function submit(close: boolean = false) {
    form.submit().then((res) => {
      if (res) {
        props.onSubmit?.(res.data);
        if (close) {
          setOpen(false);
        } else {
          form.reset({
            ...form.getValues(),
            skill_id: undefined
          });
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill to Inspector</DialogTitle>
          <DialogDescription>No description available</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <Form {...form}>
            <FormField
              render={({field}) => {
                return (
                  <VFormField label={'Skills'}>
                    <SkillSelect {...field} onValueChane={(value) => {field.onChange(value)}} placeholder={'Choose skills'} />
                  </VFormField>
                );
              }}
              name={'skill_id'}
              control={form.control}
            />
          </Form>
        </DialogInnerContent>
        <DialogFooter>
          <Button onClick={() => submit(false)}>
            Save & Add Another
          </Button>
          <Button onClick={() => submit(true)}>
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
