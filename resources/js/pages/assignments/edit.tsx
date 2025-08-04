import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import Layout from '@/layouts/app-layout';
import { AssignmentForm } from '@/pages/assignments/form';
import { Assignment, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface EditProps {
  assignment: Assignment;
}

export default function Edit(props: EditProps) {
  const [hash, setHash] = useLocationHash('timesheets');

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
        <AssignmentForm value={props.assignment} onSubmit={() => {}}>
          <Button variant={'outline'}>Edit</Button>
        </AssignmentForm>
      }
    >
      <Head title={props.assignment.project?.title || 'The Assignment'} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'timesheets'}>Timesheet</TabsTrigger>
              <TabsTrigger value={'inspector-report'}>Inspector Report</TabsTrigger>
              <TabsTrigger value={'comments'}>Comments & Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value={'timesheets'}>TODO: Timesheet items</TabsContent>
            <TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>
            <TabsContent value={'comments'}>
              <Comments commentableType={'Assignment'} commentableId={props.assignment.id} />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Information</InfoHead>
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
            <Divider className={'my-2'} />
            <InfoHead>Assignee</InfoHead>
            <InfoLine label={'Name'} icon={'user-2'}>
              <Badge variant={'outline'}>{props.assignment.inspector?.name || 'N/A'}</Badge>
            </InfoLine>
            <InfoLine label={'Email Address'} icon={'at-sign'}>
              <a href={`mailto:${props.assignment.inspector?.email || ''}`} className={'underline'}>
                {props.assignment.inspector?.email || 'N/A'}
              </a>
            </InfoLine>
            <Divider className={'my-2'} />
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.assignment.notes || 'N/A'}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}
