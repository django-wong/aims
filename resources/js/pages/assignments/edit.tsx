import { Comments } from '@/components/comments';
import { ForOperationOffice } from '@/components/for-operation-office';
import { HideFromClient, VisibleToClient } from '@/components/hide-from-client';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrg } from '@/hooks/use-org';
import { useQueryParam } from '@/hooks/use-query-param';
import Layout from '@/layouts/app-layout';
import { AssignmentAttachments } from '@/pages/assignments/assignment-attachments';
import { AssignmentInspectors } from '@/pages/assignments/assignment-inspectors';
import { AssignmentReports } from '@/pages/assignments/assignment-reports';
import { DailyUsage } from '@/pages/assignments/daily-usage';
import { AssignmentForm } from '@/pages/assignments/form';
import { NotificationOfInspection } from '@/pages/assignments/notification-of-inspection';
import { RejectWithMessage } from '@/pages/assignments/reject-with-message';
import { Timesheets } from '@/pages/assignments/timesheets';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { Assignment, AssignmentStatus, BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
  AlarmClockIcon,
  ChartNoAxesColumnIcon,
  CheckCheckIcon,
  ClockFadingIcon,
  FileCheckIcon,
  MessagesSquare,
  PaperclipIcon,
  PencilIcon,
  SendIcon,
  UserRoundSearchIcon,
} from 'lucide-react';
import { ForContractHolderOffice } from '@/components/for-contract-holder-office';
import axios from 'axios';
import { AssignmentStatusBadge } from '@/pages/assignments/assignment-status-badge';
import { PopoverConfirm } from '@/components/popover-confirm';
import { useIsClient } from '@/hooks/use-role';

interface EditProps {
  assignment: Assignment;
}

export default function Edit(props: EditProps) {
  const [hash, setHash] = useQueryParam('tab', 'overview');
  const isClient = useIsClient();

  const org = useOrg();

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
    <AssignmentProvider value={props.assignment}>
      <Layout
        breadcrumbs={breadcrumbs}
        largeTitle={'View Assignment'}
        pageAction={
          <>
            {/*<AssignmentActions assignment={props.assignment}/>*/}
            <VisibleToClient>
              <NotificationOfInspection>
                <Button variant={'outline'}>
                  <AlarmClockIcon/>
                  Notification of Inspection
                </Button>
              </NotificationOfInspection>
            </VisibleToClient>

            <HideFromClient>
              <ForOperationOffice>
                {props.assignment.status === AssignmentStatus.ISSUED && (
                  <>
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure accept this assignment?')) {
                          axios.post('/api/v1/assignments/' + props.assignment.id + '/accept').then(() => {
                            router.reload();
                          });
                        }
                      }}>
                      <CheckCheckIcon />
                      Acknowledge
                    </Button>
                    <RejectWithMessage />
                  </>
                )}
              </ForOperationOffice>
            </HideFromClient>
            <HideFromClient>
              <ForContractHolderOffice>
                {props.assignment.delegated && [AssignmentStatus.REJECTED, AssignmentStatus.DRAFT].indexOf(props.assignment.status) !== -1 && (
                  <PopoverConfirm side={'bottom'} align={'end'} message={'Please make sure you have all files uploaded.'} onConfirm={() => {
                        axios.post('/api/v1/assignments/' + props.assignment.id + '/send-to-operation-office').then(() => {
                          router.reload();
                        });
                      }}>
                    <Button variant={'outline'}>
                      <SendIcon />
                      Send to coordination office
                    </Button>
                  </PopoverConfirm>
                )}
              </ForContractHolderOffice>
            </HideFromClient>
            <HideFromClient>
              {/* Delegated to my office but haven't accepted it */}
              {props.assignment.operation_org_id === org?.id && props.assignment.status < AssignmentStatus.ACCEPTED ? null : (
                <AssignmentForm
                  value={props.assignment}
                  onSubmit={() => {
                    router.reload();
                  }}
                >
                  <Button>
                    <PencilIcon /> Edit
                  </Button>
                </AssignmentForm>
              )}
            </HideFromClient>
          </>
        }
      >
        <Head title={props.assignment.project?.title || 'The Assignment'} />
        <TwoColumnLayout73
          left={
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList className={'mb-4'}>
                <TabsTrigger value={'overview'}>
                  <ChartNoAxesColumnIcon />
                  <span className={'hidden sm:inline'}>Overview</span>
                </TabsTrigger>
                <TabsTrigger value={'attachments'}>
                  <PaperclipIcon />
                  <span className={'hidden sm:inline'}>Attachments</span>
                </TabsTrigger>
                <HideFromClient>
                  <TabsTrigger value={'inspectors'}>
                    <UserRoundSearchIcon />
                    <span className={'hidden sm:inline'}>Inspectors</span>
                  </TabsTrigger>
                </HideFromClient>
                <TabsTrigger value={'timesheets'}>
                  <ClockFadingIcon />
                  <span className={'hidden sm:inline'}>Timesheet</span>
                </TabsTrigger>
                <TabsTrigger value={'reports'}>
                  <FileCheckIcon />
                  <span className={'hidden sm:inline'}>Reports</span>
                </TabsTrigger>
                <HideFromClient>
                  <TabsTrigger value={'comments'}>
                    <MessagesSquare />
                    <span className={'hidden sm:inline'}>Comments</span>
                  </TabsTrigger>
                </HideFromClient>
              </TabsList>
              <TabsContent value={'overview'}>
                <DailyUsage />
              </TabsContent>
              <TabsContent value={'attachments'}>
                <AssignmentAttachments allowUpload={!isClient}/>
              </TabsContent>
              <HideFromClient>
                <TabsContent value={'inspectors'}>
                  <AssignmentInspectors />
                </TabsContent>
              </HideFromClient>
              <TabsContent value={'timesheets'}>
                <div className={'grid gap-4'}>
                  <Timesheets
                    assignment={props.assignment}
                    filters={{
                      // 'filter[status]': '> 0',
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value={'reports'}>
                <AssignmentReports />
              </TabsContent>
              {/*<TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>*/}
              <HideFromClient>
                <TabsContent value={'comments'}>
                  <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
                </TabsContent>
              </HideFromClient>
            </Tabs>
          }
          right={
            <Info>
              <InfoHead>Basic Information</InfoHead>
              <div>
                <InfoLine icon={'hash'} label={'BIE Reference Number'}>
                  {props.assignment.reference_number ?? 'N/A'}
                </InfoLine>
                <InfoLine icon={'square-user-round'} label={'Coordinator'}>
                  {props.assignment.coordinator ? (
                    <a className={'underline'} href={`mailto:${props.assignment.coordinator.email}`}>
                      {props.assignment.coordinator?.name}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </InfoLine>
                <HideFromClient>
                  <InfoLine icon={'shopping-bag'} label={'Contract Holder Ref / WO No.'}>
                    <Link href={`/purchase-orders/${props.assignment.purchase_order_id || ''}`} className={'underline'}>
                      {props.assignment.purchase_order?.title ?? 'N/A'}
                    </Link>
                  </InfoLine>
                </HideFromClient>
                <InfoLine icon={'square-arrow-out-up-right'} label={'Project'}>
                  <Link href={`/projects/${props.assignment.project?.id || ''}`} className={'underline'}>
                    {props.assignment.project?.title ?? 'N/A'}
                  </Link>
                </InfoLine>
                <InfoLine icon={'info'} label={'Type'}>
                  <Badge variant={'outline'}>{props.assignment.project?.project_type?.name || 'N/A'}</Badge>
                </InfoLine>
                <InfoLine icon={'file-clock'} label={'PO Delivery Date'}>
                  <Badge variant={'outline'}>
                    {props.assignment.po_delivery_date ? dayjs(props.assignment.po_delivery_date).format('DD/MM/YYYY') : 'N/A'}
                  </Badge>
                </InfoLine>
                <InfoLine icon={'building-2'} label={'Operation Office'}>
                  {props.assignment.operation_org?.name || 'N/A'}
                </InfoLine>
                <InfoLine icon={'square-user-round'} label={'Operation Office Coordinator'}>
                  {props.assignment.operation_coordinator ? (
                    <a className={'underline'} href={`mailto:${props.assignment.operation_coordinator?.email}`}>
                      {props.assignment.operation_coordinator?.name}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </InfoLine>
                <InfoLine icon={'target'} label={'Status'}>
                  <AssignmentStatusBadge/>
                </InfoLine>
                <InfoLine icon={'clock-2'} label={'Hours'}>
                  {props.assignment.purchase_order?.budgeted_hours || 'N/A'}
                </InfoLine>
                <InfoLine icon={'car'} label={'Mileage'}>
                  {props.assignment.purchase_order?.budgeted_mileage} {props.assignment.purchase_order?.mileage_unit}
                </InfoLine>
              </div>

              <Accordion type={'multiple'}>
                <AccordionItem value={'client'}>
                  <AccordionTrigger>Client</AccordionTrigger>
                  <AccordionContent>
                    <InfoLine label={'Business Name'}>{props.assignment.project?.client?.business_name || 'N/A'}</InfoLine>
                    <InfoLine label={'Code'}>{props.assignment.project?.client?.code || 'N/A'}</InfoLine>
                    <InfoLine label={'Reviewer'}>{props.assignment.project?.client?.reviewer?.name || 'N/A'}</InfoLine>
                    <InfoLine label={'Coordinator'}>{props.assignment.project?.client?.coordinator?.name || 'N/A'}</InfoLine>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={'vendor'}>
                  <AccordionTrigger>Vendor</AccordionTrigger>
                  <AccordionContent>
                    <InfoLine label={'Main Vendor'}>{props.assignment.vendor?.business_name || 'N/A'}</InfoLine>
                    <InfoLine label={'Sub Vendor'}>{props.assignment.sub_vendor?.business_name || 'N/A'}</InfoLine>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value={'equipment'}>
                  <AccordionTrigger>Equipment</AccordionTrigger>
                  <AccordionContent>
                    <InfoLine label={'Equipment Category'}>{props.assignment.skill?.code || 'N/A'}</InfoLine>
                    <InfoLine label={'Description'}>{props.assignment.equipment || 'N/A'}</InfoLine>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {props.assignment.notes && (
                <HideFromClient>
                  <InfoHead>Notes</InfoHead>
                  <InfoLineValue className={'justify-start'}>{props.assignment.notes || 'N/A'}</InfoLineValue>
                </HideFromClient>
              )}
            </Info>
          }
        />
      </Layout>
    </AssignmentProvider>
  );
}
