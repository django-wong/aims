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
import { NotificationOfInspectionForm } from '@/pages/assignments/notification-of-inspection-form';
import { RejectWithMessage } from '@/pages/assignments/reject-with-message';
import { TimesheetsTable } from '@/pages/assignments/timesheets-table';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { Assignment, AssignmentDetail, AssignmentStatus, BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import {
  AlarmClockIcon,
  ChartNoAxesColumnIcon,
  CheckCheckIcon,
  ClockFadingIcon,
  FileCheckIcon,
  FlagTriangleRightIcon,
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
import { formatCurrency } from '@/lib/helpers';
import { useState } from 'react';

interface AssignmentEditProps {
  assignment: Assignment;
  detail: AssignmentDetail
}

export default function AssignmentEdit(props: AssignmentEditProps) {
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
            <VisibleToClient>
              <NotificationOfInspectionForm>
                <Button variant={'outline'}>
                  <FlagTriangleRightIcon/>
                  Notification of Inspection
                </Button>
              </NotificationOfInspectionForm>
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
                <TabsTrigger value={'comments'}>
                  <MessagesSquare />
                  <span className={'hidden sm:inline'}>Comments</span>
                </TabsTrigger>
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
                  <TimesheetsTable
                    filters={{
                      'filter[assignment_id]': String(props.assignment?.id)
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value={'reports'}>
                <AssignmentReports />
              </TabsContent>
              {/*<TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>*/}
              <TabsContent value={'comments'}>
                <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
              </TabsContent>
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
              </div>

              <InfoHead>Budget vs Usage</InfoHead>
              <p className={'text-sm text-muted-foreground'}>Please aware the usage does not include other assignment that share the same work order</p>
              <div>
                <InfoLine icon={'clock-2'} label={'Hours'}>
                  {props.assignment.purchase_order?.budgeted_hours || 'N/A'} <span className={'text-sm text-muted-foreground'}>vs</span> {props.detail.hours}
                </InfoLine>
                <InfoLine icon={'car'} label={'Travel'}>
                  {props.assignment.purchase_order?.budgeted_travel} <span className={'text-sm text-muted-foreground'}>vs</span> {props.detail.travel_distance}{props.assignment.purchase_order?.travel_unit}
                </InfoLine>
                <InfoLine icon={'car'} label={'Expense'}>
                  {formatCurrency(props.assignment.purchase_order?.budgeted_expenses)} <span className={'text-sm text-muted-foreground'}>vs</span> {formatCurrency(props.detail.expenses)}
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
