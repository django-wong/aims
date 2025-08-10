import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/layouts/app-layout';
import { AssignmentForm } from '@/pages/assignments/form';
import { Assignment, BreadcrumbItem, TimesheetItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { AssignmentActions } from '@/pages/assignments';
import { CircleAlert, Clock, MessagesSquare, Newspaper } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQueryParam } from '@/hooks/use-query-param';

interface EditProps {
  assignment: Assignment;
}

export default function Edit(props: EditProps) {
  const [hash, setHash] = useQueryParam('tab', 'timesheets');

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
              <TabsTrigger value={'timesheets'}>
                <Clock/>
                <span className={'hidden sm:inline'}>Timesheet</span>
              </TabsTrigger>
              <TabsTrigger value={'inspector-report'}>
                <Newspaper/>
                <span className={'hidden sm:inline'}>Inspector Report</span>
              </TabsTrigger>
              <TabsTrigger value={'comments'}>
                <MessagesSquare/>
                <span className={'hidden sm:inline'}>Comments</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={'timesheets'}>
              <div className={'grid gap-4'}>
                <TimesheetItems assignment={props.assignment}/>
              </div>
            </TabsContent>
            <TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>
            <TabsContent value={'comments'}>
              <Comments
                commentableType={'Assignment'}
                commentableId={props.assignment.id}
              />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Information</InfoHead>
            <div>
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
            </div>
            <Divider className={'my-2'} />
            <InfoHead>Assignee</InfoHead>
            <div>
              <InfoLine label={'Name'} icon={'user-2'}>
                <Badge variant={'outline'}>{props.assignment.inspector?.name || 'N/A'}</Badge>
              </InfoLine>
              <InfoLine label={'Email Address'} icon={'at-sign'}>
                <a href={`mailto:${props.assignment.inspector?.email || ''}`} className={'underline'}>
                  {props.assignment.inspector?.email || 'N/A'}
                </a>
              </InfoLine>
            </div>
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
    accessorKey: 'hours',
    header: 'Hours',
    cell: ({ row }) => row.original.hours.toFixed(1),
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
    cell: ({ row }) => `${row.original.cost}`,
  },
  {
    accessorKey: 'travel_distance',
    header: 'KM/Miles',
    cell: ({ row }) => row.original.travel_distance.toFixed(1),
  },
  {
    accessorKey: 'travel_cost',
    header: 'Travel Cost',
    cell: ({ row }) => `${row.original.travel_cost}`,
  },
  {
    accessorKey: 'days and overnights',
    header: 'D & N',
    cell: ({ row }) => `${row.original.days} / ${row.original.overnights}`,
  },
  {
    accessorKey: 'expenses',
    header: 'Expenses',
    cell: ({ row }) => `${row.original.total_expense}`,
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
    <DataTable table={table} variant={'clean'} pagination={false} className={'gap-0 bg-background w-full overflow-hidden'}/>
  );
}
