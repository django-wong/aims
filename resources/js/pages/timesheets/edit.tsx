import AppLayout from '@/layouts/app-layout';
import { Assignment, BreadcrumbItem, Timesheet } from '@/types';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { TimesheetProvider, useTimesheet } from '@/providers/timesheet-provider';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { useQueryParam } from '@/hooks/use-query-param';

interface EditTimesheetProps {
  timesheet: Timesheet;
  assignment: Assignment;
}

export default function EditTimesheet(props: EditTimesheetProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: `Assignment ${props.assignment.reference_number}`,
      href: route('assignments.edit', props.assignment.id)
    }
  ];

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title={'Edit Timesheet'} />
        <AssignmentProvider value={props.assignment}>
          <TimesheetProvider value={props.timesheet}>
            <div className={'px-6'}>

            </div>
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
