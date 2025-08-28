import { PopoverConfirm } from '@/components/popover-confirm';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, User, DialogFormProps, UserSkill } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Trash, UserRoundPen, Plus, Trash2Icon } from 'lucide-react';
import { InspectorForm } from '@/pages/inspectors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import * as React from 'react';
import { useState } from 'react';
import { useLocationHash } from '@/hooks/use-location-hash';
import { useTable } from '@/hooks/use-table';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { Input } from '@/components/ui/input';
import { useDebouncer } from '@/hooks/use-debounced';
import { ColumnDef } from '@tanstack/react-table';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { useReactiveForm } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { SkillSelect } from '@/components/skill-select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface InspectorEditProps {
  inspector: User;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Inspectors',
    href: route('inspectors'),
  },
];

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
    header: 'I/E/A',
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

const schema = z.object({
  skill_id: z.number().min(1, 'Skill is required'),
  user_id: z.number().min(1),
});

function UserSkillForm(props: DialogFormProps<User, UserSkill>) {
  const form = useReactiveForm<z.infer<typeof schema>, UserSkill>({
    url: '/api/v1/user-skills',
    defaultValues: {
      user_id: props.value?.id
    },
    resolver: zodResolver(schema)
  });

  function submit() {
    form.submit().then((res) => {
      if (res) {
        props.onSubmit(res.data)
      }
    })
  }
  return (
    <Dialog>
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
          <Button onClick={submit}>
            Add Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function EditPage(props: InspectorEditProps) {
  const [hash, setHash] = useLocationHash('skills');

  return (
    <Layout
      pageAction={
        <>
          <PopoverConfirm
            asChild
            message={'Are you sure to delete this inspector? THis action cannot be undone.'}
            onConfirm={() => {
              axios.delete(route('users.destroy', { id: props.inspector.id })).then(() => {
                router.visit(route('inspectors'));
              });
            }}
          >
            <Button size={'sm'} variant={'secondary'}>
              <Trash /> Delete
            </Button>
          </PopoverConfirm>
          <InspectorForm
            value={props.inspector}
            onSubmit={() => {
              window.location.reload();
            }}
          >
            <Button size={'sm'} variant={'secondary'}>
              <UserRoundPen /> Edit
            </Button>
          </InspectorForm>
        </>
      }
      breadcrumbs={[...breadcrumbs, { title: props.inspector.name, href: '.' }]}
    >
      <Head title={props.inspector.name} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'skills'}>Skills</TabsTrigger>
              <TabsTrigger value={'certificates'}>Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value={'skills'}>
              <UserSkills inspector={props.inspector} />
            </TabsContent>
            <TabsContent value={'certificates'}>
              <UserCertificates inspector={props.inspector} />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Inspector Profile</InfoHead>
            <div>
              <InfoLine label={'Name'} icon={'user'}>
                {props.inspector.name}
              </InfoLine>
              <InfoLine label={'Email'} icon={'mail'}>
                {props.inspector.email}
              </InfoLine>
              <InfoLine label={'Initials'} icon={'type'}>
                {props.inspector.inspector_profile?.initials ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Assigned ID'} icon={'id-card'}>
                {props.inspector.inspector_profile?.assigned_identifier ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Address'} icon={'map-pin'}>
                {props.inspector.address?.full_address ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Hourly Rate'} icon={'dollar-sign'}>
                {props.inspector.inspector_profile?.hourly_rate != null ? `$${props.inspector.inspector_profile.hourly_rate}` : 'N/A'}
              </InfoLine>
              <InfoLine label={'Travel Rate'} icon={'car'}>
                {props.inspector.inspector_profile?.travel_rate != null ? `$${props.inspector.inspector_profile.travel_rate}` : 'N/A'}
              </InfoLine>
              {(props.inspector.inspector_profile?.new_hourly_rate != null ||
                props.inspector.inspector_profile?.new_travel_rate != null ||
                props.inspector.inspector_profile?.new_rate_effective_date != null) && (
                <>
                  <InfoLine label={'New Hourly Rate'} icon={'trending-up'}>
                    {props.inspector.inspector_profile?.new_hourly_rate != null ? `$${props.inspector.inspector_profile.new_hourly_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'New Travel Rate'} icon={'trending-up'}>
                    {props.inspector.inspector_profile?.new_travel_rate != null ? `$${props.inspector.inspector_profile.new_travel_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'Effective Date'} icon={'calendar'}>
                    {props.inspector.inspector_profile?.new_rate_effective_date ?? 'N/A'}
                  </InfoLine>
                </>
              )}
              <InfoLine label={'On Skills Matrix'} icon={'check-circle'}>
                {props.inspector.inspector_profile?.include_on_skills_matrix ? 'Yes' : 'No'}
              </InfoLine>
            </div>
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.inspector.inspector_profile?.notes}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}

interface UserSkillsProps {
  inspector: User;
}

function UserSkills(props: UserSkillsProps) {
  const table = useTable(`/api/v1/user-skills`, {
    columns: user_skills_columns,
    defaultParams: {
      'user_id': String(props.inspector.id),
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
          <UserSkillForm value={props.inspector} onSubmit={() => table.reload()}>
            <Button>
              <Plus/> Add Skill
            </Button>
          </UserSkillForm>
        }
      />
    </div>
  );
}


interface UserCertificatesProps {
  inspector: User;
}

function UserCertificates(props: UserCertificatesProps) {
  return <div>TODO</div>;
}
