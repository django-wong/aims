import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, NotificationOfInspection } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine, InfoLineLabel, InfoLineValue } from '@/components/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttachmentList } from '@/components/attachments/list';
import { useQueryParam } from '@/hooks/use-query-param';
import { Activities } from '@/components/activities';
import { formatDate, formatDateTime } from '@/lib/helpers';
import { NotificationOfInspectionProvider } from '@/providers/notification-of-inspection-provider';
import { NotificationOfInspectionPageAction } from '@/pages/notification-of-inspections/page-actions';
import { NotificationOfInspectionStatusBadge } from '@/pages/notification-of-inspections/status-badge';

interface EditProps {
  notification_of_inspection: NotificationOfInspection;
}

export default function Edit(props: EditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Notification of Inspections',
      href: '/notification-of-inspections',
    },
    {
      title: `${props.notification_of_inspection.assignment?.reference_number ?? props.notification_of_inspection.id}`,
      href: `.`,
    },
  ];

  const [tab, setTab] = useQueryParam('tab', 'attachments');

  return (
    <NotificationOfInspectionProvider value={props.notification_of_inspection}>
      <Layout breadcrumbs={breadcrumbs} pageAction={<NotificationOfInspectionPageAction/>}>
        <Head title="edit" />
        <TwoColumnLayout73
          left={
            <div>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className={'mb-2'}>
                  <TabsTrigger value={'attachments'}>Attachments</TabsTrigger>
                  <TabsTrigger value={'activities'}>Activities</TabsTrigger>
                </TabsList>
                <TabsContent value={'attachments'}>
                  <AttachmentList
                    allowUpload={true}
                    attachable_id={props.notification_of_inspection.id}
                    attachable_type={'notification_of_inspection'}
                  />
                </TabsContent>
                <TabsContent value={'activities'}>
                  <Activities subject_type={'notification_of_inspection'} subject_id={props.notification_of_inspection.id} />
                </TabsContent>
              </Tabs>
            </div>
          }
          right={
            <div>
              <Info>
                <div>
                  <InfoHead>About</InfoHead>
                  <InfoLine label={'Assignment'}>
                    <Link className={'link'} href={`/assignments/${props.notification_of_inspection.assignment_id}`}>
                      {props.notification_of_inspection.assignment?.reference_number ?? `#${props.notification_of_inspection.assignment_id}`}
                    </Link>
                  </InfoLine>
                  <InfoLine label={'From'}>
                    {formatDateTime(props.notification_of_inspection.from)}
                  </InfoLine>
                  <InfoLine label={'To'}>
                    {formatDateTime(props.notification_of_inspection.from)}
                  </InfoLine>
                  <InfoLine label={'Location'}>
                    {props.notification_of_inspection.location}
                  </InfoLine>
                  <InfoLine label={'Status'}>
                    <NotificationOfInspectionStatusBadge status={props.notification_of_inspection.status}/>
                  </InfoLine>
                </div>
                <div>
                  <InfoLineLabel>Description</InfoLineLabel>
                  <div>{props.notification_of_inspection.description}</div>
                </div>
              </Info>
            </div>
          }
        />
      </Layout>
    </NotificationOfInspectionProvider>
  );
}
