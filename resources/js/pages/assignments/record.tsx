import { Comments } from '@/components/comments';
import { useTableApi } from '@/components/data-table-2';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQueryParam } from '@/hooks/use-query-param';
import { BaseLayout } from '@/layouts/base-layout';
import { timesheet_range } from '@/lib/utils';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { TimesheetItemActions, TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { TimesheetProvider } from '@/providers/timesheet-provider';
import { Assignment, SharedData, Timesheet, TimesheetStatus } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeftIcon, ArrowRightIcon, BookmarkCheck, ClockIcon, MessageCircleIcon, Plus, SendIcon, UserCircle } from 'lucide-react';
import { useState } from 'react';

interface RecordProps {
  assignment: Assignment;
  timesheet: Timesheet;
  start: string;
  end: string;
  prev: string;
  next: string;
}

export default function Record(props: RecordProps) {
  const page = usePage<SharedData>();

  const [hash, setHash] = useQueryParam('tab', 'timesheet');

  function signoff() {
    axios.post('/api/v1/timesheets/' + props.timesheet.id + '/sign-off').then((response) => {
      if (response.data) {
        router.reload();
      }
    });
  }

  const editable = props.timesheet?.status === TimesheetStatus.Draft;

  const range = timesheet_range(props);

  return (
    <TimesheetProvider value={props.timesheet}>
      <BaseLayout>
        <Head title={props.assignment.project?.title} />
        <div className={'flex w-full flex-1 flex-col'}>
          <>
            <>
              <div className={'p-6 py-8'}>
                <div>
                  <div className={'mb-4 flex items-center justify-between'}>
                    <div className={'-ml-3 flex items-center gap-2 text-3xl font-bold'}>
                      <BookmarkCheck className={'h-16 w-16'} />
                    </div>
                    <div className={'hidden gap-4 sm:flex'}>
                      <Button variant={'outline'}>
                        <span className={'hidden md:inline'}>{page.props.auth.user?.name}</span>
                        <UserCircle />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={'flex flex-col gap-4'}>
                  <h1 className={'text-xl font-bold'}>{props.assignment.project?.title}</h1>
                  {/*<div className={'flex justify-start'}>*/}
                  {/*  <div className={'flex items-center justify-start gap-2 rounded-lg border px-2 py-1 text-sm'}>*/}
                  {/*    <House className={'w-4'} />*/}
                  {/*    {(props.assignment.operation_org || props.assignment.org)?.name ?? 'Org Name'}*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>
              <TwoColumnLayout73
                className={'relative'}
                right={
                  <Info>
                    <InfoHead>Details</InfoHead>
                    <div>
                      <InfoLine label={'Client Name'}>{props.assignment.project?.client?.business_name}</InfoLine>
                      <InfoLine label={'Project'}>{props.assignment.project?.title}</InfoLine>
                      <InfoLine label={'Assignment Type'}>
                        <Badge>{props.assignment.assignment_type?.name}</Badge>
                      </InfoLine>
                      <InfoLine label={'Vendor'}>{props.assignment.vendor?.name}</InfoLine>
                      {props.assignment.sub_vendor && <InfoLine label={'Sub Vendor'}>{props.assignment.sub_vendor?.name}</InfoLine>}
                      <InfoLine label={'Report Required'}>
                        <Badge variant={props.assignment.report_required ? 'default' : 'secondary'}>
                          {props.assignment.report_required ? 'Yes' : 'No'}
                        </Badge>
                      </InfoLine>
                      {props.assignment.equipment && (
                        <InfoLine label={'Equipment'}>
                          <InfoLineValue className="whitespace-pre-wrap">{props.assignment.equipment}</InfoLineValue>
                        </InfoLine>
                      )}
                    </div>

                    <InfoHead>Visit Information</InfoHead>
                    <div>
                      <InfoLine label={'First Visit Date'}>{props.assignment.first_visit_date || 'N/A'}</InfoLine>
                      <InfoLine label={'Visit Frequency'}>{props.assignment.visit_frequency || 'N/A'}</InfoLine>
                      <InfoLine label={'Total Visits'}>{props.assignment.total_visits || 'N/A'}</InfoLine>
                      <InfoLine label={'Hours per Visit'}>{props.assignment.hours_per_visit || 'N/A'}</InfoLine>
                      <InfoLine label={'Visit Contact'}>{props.assignment.visit_contact?.name || 'N/A'}</InfoLine>
                    </div>

                    <InfoHead>Scope of the assignment</InfoHead>
                    <div>
                      <InfoLine label={'Pre-inspection Meeting'}>
                        <Badge variant="outline">{props.assignment.pre_inspection_meeting ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Final Inspection'}>
                        <Badge variant="outline">{props.assignment.final_inspection ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Dimensional'}>
                        <Badge variant="outline">{props.assignment.dimensional ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Sample Inspection'}>
                        <Badge variant="outline">{props.assignment.sample_inspection ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Witness of Tests'}>
                        <Badge variant="outline">{props.assignment.witness_of_tests ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Monitoring'}>
                        <Badge variant="outline">{props.assignment.monitoring ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Packing'}>
                        <Badge variant="outline">{props.assignment.packing ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Document Review'}>
                        <Badge variant="outline">{props.assignment.document_review ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Expediting'}>
                        <Badge variant="outline">{props.assignment.expediting ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Audit'}>
                        <Badge variant="outline">{props.assignment.audit ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                    </div>

                    <InfoHead>Status / flash report</InfoHead>
                    <div>
                      <InfoLine label={'Exit Call Required'}>
                        <Badge variant="outline">{props.assignment.exit_call ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Flash Report Required'}>
                        <Badge variant="outline">{props.assignment.flash_report ? 'Yes' : 'No'}</Badge>
                      </InfoLine>
                      {props.assignment.contact_details && <InfoLine label={'Contact Details'}>{props.assignment.contact_details}</InfoLine>}
                      {props.assignment.contact_email && <InfoLine label={'Contact Email'}>{props.assignment.contact_email}</InfoLine>}
                    </div>

                    <InfoHead>Report format</InfoHead>
                    <div>
                      <InfoLine label={'Reporting Format'}>
                        <Badge variant="outline">{props.assignment.reporting_format === 0 ? 'BIE' : 'Client'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Reporting Frequency'}>
                        <Badge variant="outline">{props.assignment.reporting_frequency === 0 ? 'Daily' : 'Weekly'}</Badge>
                      </InfoLine>
                      {props.assignment.send_report_to_email && <InfoLine label={'Send Report To'}>{props.assignment.send_report_to_email}</InfoLine>}
                      <InfoLine label={'Timesheet Format'}>
                        <Badge variant="outline">{props.assignment.timesheet_format === 0 ? 'BIE' : 'Client'}</Badge>
                      </InfoLine>
                      <InfoLine label={'NCR Format'}>
                        <Badge variant="outline">{props.assignment.ncr_format === 0 ? 'BIE' : 'Client'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Punch List Format'}>
                        <Badge variant="outline">{props.assignment.punch_list_format === 0 ? 'BIE' : 'Client'}</Badge>
                      </InfoLine>
                      <InfoLine label={'IRN Format'}>
                        <Badge variant="outline">{props.assignment.irn_format === 0 ? 'BIE' : 'Client'}</Badge>
                      </InfoLine>
                      <InfoLine label={'Document Stamp'}>
                        <Badge variant="outline">{props.assignment.document_stamp === 0 ? 'BIE' : 'Sign'}</Badge>
                      </InfoLine>
                    </div>

                    <InfoHead>Notes</InfoHead>
                    <div className={'bg-accent ring-muted overflow-hidden rounded-lg border px-4 ring-6'}>
                      {(props.assignment.notes || props.assignment.special_notes) && (
                        <Accordion type="multiple" className="w-full">
                          <AccordionItem value="notes">
                            <AccordionTrigger>Notes</AccordionTrigger>
                            <AccordionContent>
                              <div className="text-muted-foreground text-sm whitespace-pre-wrap">{props.assignment.notes}</div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="special-notes">
                            <AccordionTrigger>Special Notes</AccordionTrigger>
                            <AccordionContent>
                              <div className="text-muted-foreground text-sm whitespace-pre-wrap">
                                {props.assignment.special_notes ?? 'No special notes available.'}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  </Info>
                }
                left={
                  <Tabs value={hash} onValueChange={setHash} className={'h-full gap-6'}>
                    <TabsList>
                      <TabsTrigger value={'timesheet'}>
                        <ClockIcon />
                        <span className={'hidden sm:inline'}>Timesheet</span>
                      </TabsTrigger>
                      <TabsTrigger value={'comments'}>
                        <MessageCircleIcon />
                        <span className={'hidden sm:inline'}>Comments & Attachments</span>
                      </TabsTrigger>
                    </TabsList>
                    <Info className={'relative flex flex-1 flex-col'}>
                      <TabsContent value={'timesheet'} className={'relative flex flex-1 flex-col gap-4'}>
                        <TimesheetItems
                          actions={(value) => {
                            return <TimesheetItemActions editable={editable} value={value} />;
                          }}
                          timesheet={props.timesheet}
                          assignment={props.assignment}
                          datatable={{
                            left: (
                              <>
                                <div className={'flex items-center gap-2'}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button variant={'outline'} asChild>
                                        <Link href={'?start=' + props.prev}>
                                          <ArrowLeftIcon />
                                        </Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Previous week</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button variant={'outline'} className={'font-mono'} asChild>
                                        <Link href={window.location.pathname}>{range}</Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Click to go back to current week</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Button variant={'outline'} asChild>
                                        <Link href={'?start=' + props.next}>
                                          <ArrowRightIcon />
                                        </Link>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Next week</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  #{props.timesheet.id}
                                </div>
                              </>
                            ),
                            right: (
                              <div className={'flex items-center justify-end gap-2'}>
                                {editable && (
                                  <>
                                    <LogYourTime timesheet={props.timesheet} />
                                    <SignOffForm onConfirm={signoff}>
                                      <Button variant={'destructive'} disabled={props.timesheet?.status !== TimesheetStatus.Draft}>
                                        <SendIcon />
                                        Submit for Approval
                                      </Button>
                                    </SignOffForm>
                                  </>
                                )}
                              </div>
                            ),
                          }}
                        />
                      </TabsContent>
                      <TabsContent value={'comments'}>
                        <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
                      </TabsContent>
                    </Info>
                  </Tabs>
                }
              />
            </>
          </>
        </div>
      </BaseLayout>
    </TimesheetProvider>
  );
}

interface LogYourTimeProps {
  timesheet: Timesheet;
}

function LogYourTime(props: LogYourTimeProps) {
  const table = useTableApi();
  return (
    <div className={'flex items-center justify-end gap-4'}>
      <TimesheetItemForm
        timesheet={props.timesheet}
        onSubmit={() => {
          table.reload();
        }}
      >
        <Button>
          <Plus />
          Log your work
        </Button>
      </TimesheetItemForm>
    </div>
  );
}

interface SignOffFormProps {
  children: React.ReactNode;
  onConfirm?: () => void;
}

function SignOffForm(props: SignOffFormProps) {
  const [open, setOpen] = useState(false);
  function onClick() {
    setOpen(false);
    props.onConfirm?.();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Off</DialogTitle>
        </DialogHeader>
        <p className={'text-sm'}>
          Don't forget to upload your weekly inspection report if applicable. Your timesheet will be signed off and no further changes can be made.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <Button variant={'destructive'} onClick={onClick}>
            Sign Off
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
