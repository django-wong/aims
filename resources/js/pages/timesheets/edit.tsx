import AppLayout from '@/layouts/app-layout';
import { Assignment, BreadcrumbItem, Timesheet } from '@/types';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { TimesheetProvider, useTimesheet } from '@/providers/timesheet-provider';
import { Head, Link } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { useQueryParam } from '@/hooks/use-query-param';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { TimesheetStatus } from '@/pages/timesheets/status';
import { formatDate } from '@/lib/helpers';
import { TimesheetIssue } from '@/pages/timesheets/issue';
import { ReportLate } from '@/pages/timesheets/report-late';

interface EditTimesheetProps {
  timesheet: Timesheet;
  assignment: Assignment;
}

export default function EditTimesheet(props: EditTimesheetProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: `${props.assignment.reference_number}`,
      href: route('assignments.edit', props.assignment.id),
    },
    {
      title: 'Timesheets',
      href: route('timesheets'),
    },
    {
      title: `#${props.timesheet.id}`,
      href: route('timesheets.edit', props.timesheet.id),
    },
  ];

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={'Edit Timesheet'} />
        <AssignmentProvider value={props.assignment}>
          <TimesheetProvider value={props.timesheet}>
            <TwoColumnLayout73
              left={
                <TimesheetEditContent/>
              }
              right={
                <>
                  <Info>
                    <InfoHead>Basic Information</InfoHead>
                    <div>
                      <InfoLine label={'Assignment'}>
                        <Link href={route('assignments.edit', props.assignment.id)} className={'link'}>
                          {props.assignment.reference_number}
                        </Link>
                      </InfoLine>
                      <InfoLine label={'Date Range'}>
                        {formatDate(props.timesheet.start)} - {formatDate(props.timesheet.end)}
                      </InfoLine>
                      <InfoLine label={'Inspector'}>
                        <Link href={route('inspectors.edit', props.timesheet.user_id)} className={'link'}>
                          {props.timesheet.user?.name}
                        </Link>
                      </InfoLine>
                      <InfoLine label={'Status'}>
                        <TimesheetStatus status={props.timesheet.status} />
                      </InfoLine>
                      <InfoLine label={'Coordinator'}>
                        {
                          [props.assignment.coordinator?.name, props.assignment.operation_coordinator?.name].filter(Boolean).join(', ') || 'N/A'
                        }
                      </InfoLine>
                    </div>
                    <InfoHead>Usage</InfoHead>
                    <div>
                      <InfoLine label={'Total Hours'}>{props.timesheet.hours}</InfoLine>
                      <InfoLine label={'Travel Distance'}>{props.timesheet.travel_distance}</InfoLine>
                      <InfoLine label={'Cost'}>
                        {props.timesheet.cost}
                      </InfoLine>
                    </div>
                    <InfoHead>Issue & Problem</InfoHead>
                    <div>
                      <InfoLine className={'items-center'} label={'Report Late'}><ReportLate/></InfoLine>
                      <InfoLine label={'Problem'}><TimesheetIssue/></InfoLine>
                    </div>
                  </Info>
                </>
              }
            />
          </TimesheetProvider>
        </AssignmentProvider>
      </AppLayout>
    </>
  );
}


export function TimesheetEditContent() {
  const [tab, setTab] = useQueryParam('timesheet-edit-tab', 'workhours');

  const timesheet = useTimesheet();
  return (
    <>
      <Tabs value={tab} onValueChange={setTab} className={'gap-6'}>
        <TabsList>
          <TabsTrigger value={'workhours'}>Work hours & Report</TabsTrigger>
          <TabsTrigger value={'activity-log'}>Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value={'workhours'}>
          <TimesheetItems timesheet={timesheet!} />
        </TabsContent>
        <TabsContent value={'activity-log'}>
          Logs coming soon...
        </TabsContent>
      </Tabs>
    </>
  );
}
