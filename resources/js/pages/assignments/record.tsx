import { Comments } from '@/components/comments';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment, SharedData, Timesheet, TimesheetStatus } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkCheck,
  ClockIcon,
  MessageCircleIcon,
  Plus,
  SendIcon,
  UserCircle,
} from 'lucide-react';
import { TimesheetItemActions, TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { useTableApi } from '@/components/data-table-2';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import axios from 'axios';
import { timesheet_range } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
    axios.post('/api/v1/timesheet/' + props.timesheet.id + '/sign-off').then((response) => {
      if (response.data) {
        router.reload();
      }
    });
  }

  const editable = props.timesheet?.status === TimesheetStatus.Draft;

  const range = timesheet_range(props);

  return (
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
                        actions={
                          (value) => {
                            return (
                              <TimesheetItemActions editable={editable} value={value}/>
                            )
                          }
                        }
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
                                      <Link href={window.location.pathname}>
                                        {range}
                                      </Link>
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
        <p>
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
