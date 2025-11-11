import { Info, InfoHead, InfoLine } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { TimesheetIssue } from '@/pages/timesheets/issue';
import { ReportLate } from '@/pages/timesheets/report-late';
import { TimesheetStatus } from '@/pages/timesheets/status';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { TimesheetProvider, useTimesheet } from '@/providers/timesheet-provider';
import { Assignment, BreadcrumbItem, Timesheet } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ClientApprove } from '@/pages/timesheets/client-approve';
import { ContractorHolderApprove } from '@/pages/timesheets/contractor-holder-approve';
import { CoordinationOfficeApprove } from '@/pages/timesheets/coordination-office-approve';
import { LogYourTime } from '@/pages/assignments/record';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HideFromClient } from '@/components/hide-from-client';
import { Activities } from '@/components/activities';
import { FlashReportSent } from '@/pages/timesheets/flash-report-sent';
import { Button } from '@/components/ui/button';
import { FileDownIcon } from 'lucide-react';

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
      <AssignmentProvider value={props.assignment}>
        <TimesheetProvider value={props.timesheet}>
          <AppLayout
            pageAction={
              <>
                <ClientApprove/>
                <ContractorHolderApprove/>
                <CoordinationOfficeApprove/>
                <HideFromClient>
                  <LogYourTime/>
                </HideFromClient>
                <HideFromClient>
                  <Button
                    variant={'outline'}
                    onClick={() => {
                      window.open(route('timesheets.pdf', props.timesheet.id), '_blank');
                    }}>
                    <FileDownIcon/>
                  </Button>
                </HideFromClient>
              </>
            }
            breadcrumbs={breadcrumbs}>
            <Head title={'Edit Timesheet'} />
            <TwoColumnLayout73
              left={<TimesheetEditContent />}
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
                      <InfoLine label={'Coordinator'}>
                        {[props.assignment.coordinator?.name, props.assignment.operation_coordinator?.name].filter(Boolean).join(', ') || 'N/A'}
                      </InfoLine>

                      <InfoLine label={'Status'}>
                        <TimesheetStatus />
                      </InfoLine>

                      {
                        props.timesheet.client_invoice_id ? (
                          <InfoLine label={'Client Invoice'}>
                            <Link href={route('invoices.edit', props.timesheet.client_invoice_id)} className={'link'}>
                              View
                            </Link>
                          </InfoLine>
                        ) : null
                      }

                      {
                        props.timesheet.contractor_invoice_id ? (
                          <InfoLine label={'Client Invoice'}>
                            <Link href={route('invoices.edit', props.timesheet.contractor_invoice_id)} className={'link'}>
                              View
                            </Link>
                          </InfoLine>
                        ) : null
                      }

                      {props.timesheet.rejected ? (
                        <InfoLine label={'Rejection Reason'} className={'text-red-600'}>
                          {props.timesheet.rejection_reason}
                        </InfoLine>
                      ) : null}
                    </div>
                    <InfoHead>Usage</InfoHead>
                    <div>
                      <InfoLine label={'Total Hours'}>{props.timesheet.hours}</InfoLine>
                      <InfoLine label={'Rate'}>
                        <Tooltip>
                          <TooltipTrigger>
                            {formatCurrency(props.timesheet.hourly_rate)}
                          </TooltipTrigger>
                          <TooltipContent>
                            This is the latest hourly rate for the assignment. It may differ from the actual rate due to adjustments.
                          </TooltipContent>
                        </Tooltip>
                      </InfoLine>
                      <InfoLine label={'Hour Cost'}>{formatCurrency(props.timesheet.hour_cost)}</InfoLine>
                      <InfoLine label={'Travel Distance'}>{props.timesheet.travel_distance} {props.timesheet.travel_unit}</InfoLine>
                      <InfoLine label={'Travel Rate'}>{formatCurrency(props.timesheet.travel_rate)}</InfoLine>
                      <InfoLine label={'Expenses'}>{formatCurrency(props.timesheet.expenses)}</InfoLine>
                      <InfoLine label={'Cost'}>{formatCurrency(props.timesheet.cost)}</InfoLine>
                    </div>
                    <HideFromClient>
                      <InfoHead>Report & Problem</InfoHead>
                      <div>
                        <InfoLine className={'items-center'} label={'Flash Report Sent'}>
                          <FlashReportSent/>
                        </InfoLine>
                        <InfoLine className={'items-center'} label={'Report Late'}>
                          <ReportLate />
                        </InfoLine>
                        <InfoLine label={'Problem'}>
                          <TimesheetIssue />
                        </InfoLine>
                      </div>
                    </HideFromClient>
                  </Info>
                </>
              }
            />
          </AppLayout>
        </TimesheetProvider>
      </AssignmentProvider>
    </>
  );
}

export function TimesheetEditContent() {
  const [tab, setTab] = useQueryParam('timesheet-edit-tab', 'workhours');

  const timesheet = useTimesheet();

  if (!timesheet) {
    return null;
  }

  return (
    <>
      <Tabs value={tab} onValueChange={setTab} className={'gap-6'}>
        <TabsList>
          <TabsTrigger value={'workhours'}>Work hours & Report</TabsTrigger>
          <TabsTrigger value={'activity-log'}>Activity Log</TabsTrigger>
          <TabsTrigger value={'preview'}>Preview</TabsTrigger>
        </TabsList>
        <TabsContent value={'workhours'} className={'space-y-6'}>
          <TimesheetItems timesheet={timesheet!} />
        </TabsContent>
        <TabsContent value={'activity-log'}>
          <Activities subject_type={'timesheet'} subject_id={timesheet.id}/>
        </TabsContent>
        <TabsContent value={'preview'}>
          <div className={'overflow-hidden rounded border'}>
            <iframe src={route('timesheets.pdf', timesheet.id)} className={'h-[80vh] w-full'}></iframe>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
