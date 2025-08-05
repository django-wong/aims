import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import Layout from '@/layouts/app-layout';
import { AssignmentForm } from '@/pages/assignments/form';
import { Assignment, BreadcrumbItem, TimesheetItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { AssignmentActions } from '@/pages/assignments';
import { Check, CircleAlert, Send, SendHorizonal, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface EditProps {
  assignment: Assignment;
}

export default function Edit(props: EditProps) {
  const [hash, setHash] = useLocationHash('timesheets');

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Assignments',
      href: '/assignments',
    },
    {
      title: `#${props.assignment.id}`,
      href: '.',
    },
  ];

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      largeTitle={'View Assignment'}
      pageAction={
        <>
          <AssignmentActions assignment={props.assignment}/>
          <AssignmentForm value={props.assignment} onSubmit={() => {}}>
            <Button variant={'outline'}>Edit</Button>
          </AssignmentForm>
        </>
      }
    >
      <Head title={props.assignment.project?.title || 'The Assignment'} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'timesheets'}>Timesheet</TabsTrigger>
              <TabsTrigger value={'inspector-report'}>Inspector Report</TabsTrigger>
              <TabsTrigger value={'comments'}>Comments & Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value={'timesheets'}>
              <div className={'grid gap-4'}>
                <TimesheetItems assignment={props.assignment}/>
              </div>
            </TabsContent>
            <TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>
            <TabsContent value={'comments'}>
              <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Information</InfoHead>
            <InfoLine icon={'square-arrow-out-up-right'} label={'Project'}>
              <Link href={`/projects/${props.assignment.project?.id || ''}`} className={'underline'}>
                {props.assignment.project?.title ?? 'N/A'}
              </Link>
            </InfoLine>
            <InfoLine icon={'info'} label={'Project Type'}>
              <Badge>{props.assignment.project?.project_type?.name || 'N/A'}</Badge>
            </InfoLine>
            <InfoLine icon={'user-2'} label={'Client Name'}>
              {props.assignment.project?.client?.business_name || 'N/A'}
            </InfoLine>
            <InfoLine label={'Coordinator'} icon={'user-check'}>
              {props.assignment.project?.client?.coordinator?.name || 'N/A'}
            </InfoLine>
            <Divider className={'my-2'} />
            <InfoHead>Assignee</InfoHead>
            <InfoLine label={'Name'} icon={'user-2'}>
              <Badge variant={'outline'}>{props.assignment.inspector?.name || 'N/A'}</Badge>
            </InfoLine>
            <InfoLine label={'Email Address'} icon={'at-sign'}>
              <a href={`mailto:${props.assignment.inspector?.email || ''}`} className={'underline'}>
                {props.assignment.inspector?.email || 'N/A'}
              </a>
            </InfoLine>
            <Divider className={'my-2'} />
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.assignment.notes || 'N/A'}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}

function TimesheetItemActions(props: { item: TimesheetItem }) {
  const [checked, setChecked] = useState(props.item.approved);
  return (
    <div className={'flex items-center gap-2 justify-end'}>
      <Tooltip>
        <TooltipTrigger>
          <Switch checked={checked} onCheckedChange={setChecked}/>
        </TooltipTrigger>
        <TooltipContent className={'flex items-center gap-1'}>
          <CircleAlert className={'size-4'}/> Invoice will be created upon approval
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const timesheetItemColumns: ColumnDef<TimesheetItem>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => row.original.id,
    size: 60,
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
    size: 100,
    cell: ({ row }) => row.original.hours.toFixed(1),
  },
  {
    accessorKey: 'km_traveled',
    header: 'KM/Miles',
    cell: ({ row }) => row.original.km_traveled,
    size: 100,
  },
  {
    accessorKey: 'days and overnights',
    header: 'D & N',
    cell: ({ row }) => `${row.original.days} / ${row.original.overnights}`,
    size: 100,
  },
  {
    accessorKey: 'actions',
    header: 'Approved',
    cell: ({ row }) => <TimesheetItemActions item={row.original} />,
  },
];

function TimesheetItems({ assignment }: { assignment: Assignment }) {
  const table = useTable('/api/v1/timesheet-items', {
    columns: timesheetItemColumns,
    selectable: false,
    initialState: {
      pagination: {
        pageSize: 9999
      }
    },
    defaultParams: {
      'filter[assignment_id]': String(assignment.id),
    }
  });

  return (
    <div>
      <DataTable table={table} variant={'clean'} pagination={false} className={'gap-0 bg-background'}/>
    </div>
  );
}
