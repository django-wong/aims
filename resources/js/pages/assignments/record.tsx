import { Comments } from '@/components/comments';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment, SharedData, Timesheet } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookmarkCheck, ClockIcon, House, MessageCircleIcon, Plus, UserCircle } from 'lucide-react';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { useTableApi } from '@/components/data-table-2';

interface RecordProps {
  assignment: Assignment;
  timesheet?: Timesheet;
}

export default function Record(props: RecordProps) {
  const page = usePage<SharedData>();

  const [hash, setHash] = useQueryParam('tab', 'timesheet');

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
                <div className={'flex justify-start'}>
                  <div className={'flex items-center justify-start gap-2 rounded-lg border px-2 py-1 text-sm'}>
                    <House className={'w-4'} />
                    {(props.assignment.operation_org || props.assignment.org)?.name ?? 'Org Name'}
                  </div>
                </div>
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
                <Tabs value={hash} onValueChange={setHash} className={'h-full gap-4'}>
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
                        timesheet={props.timesheet}
                        assignment={props.assignment}
                        datatable={{
                          left: <LogYourTime
                            assignment_id={props.assignment.id}
                          />
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
  assignment_id: number;
}

function LogYourTime(props: LogYourTimeProps) {
  const table = useTableApi();
  return (
    <div className={'flex items-center justify-end gap-4'}>
      <TimesheetItemForm
        onSubmit={() => {
          table.reload();
        }}
        assignment={props.assignment_id}>
        <Button>
          <Plus />
          Log your work
        </Button>
      </TimesheetItemForm>
    </div>
  )
}
