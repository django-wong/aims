import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/layouts/app-layout';
import { AssignmentForm } from '@/pages/assignments/form';
import { Assignment, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AssignmentActions } from '@/pages/assignments';
import { ChartNoAxesColumnIcon, ClockFadingIcon, MessagesSquare, Newspaper } from 'lucide-react';
import { useQueryParam } from '@/hooks/use-query-param';
import { DailyUsage } from '@/pages/assignments/daily-usage';
import { Timesheets } from '@/pages/assignments/timesheets';

interface EditProps {
  assignment: Assignment;
}

export default function Edit(props: EditProps) {
  const [hash, setHash] = useQueryParam('tab', 'timesheets');

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
        <>
          <AssignmentActions assignment={props.assignment}/>
          <AssignmentForm value={props.assignment} onSubmit={() => {}}>
            <Button variant={'outline'}>Edit</Button>
          </AssignmentForm>
        </>
      }
    >
      <Head title={props.assignment.project?.title || 'The Assignment'} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'overview'}>
                <ChartNoAxesColumnIcon/>
                <span className={'hidden sm:inline'}>Overview</span>
              </TabsTrigger>
              <TabsTrigger value={'timesheets'}>
                <ClockFadingIcon/>
                <span className={'hidden sm:inline'}>Timesheet</span>
              </TabsTrigger>
              <TabsTrigger value={'inspector-report'}>
                <Newspaper/>
                <span className={'hidden sm:inline'}>Inspector Report</span>
              </TabsTrigger>
              <TabsTrigger value={'comments'}>
                <MessagesSquare/>
                <span className={'hidden sm:inline'}>Comments</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={'overview'}>
              <DailyUsage/>
            </TabsContent>
            <TabsContent value={'timesheets'}>
              <div className={'grid gap-4'}>
                <div className={'overflow-hidden'}>
                  <Timesheets
                    assignment={props.assignment}
                    filters={{
                      'filter[status]': '> 0'
                    }}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value={'inspector-report'}>TODO: Inspector report</TabsContent>
            <TabsContent value={'comments'}>
              <Comments
                commentableType={'Assignment'}
                commentableId={props.assignment.id}
              />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Basic Information</InfoHead>
            <div>
              <InfoLine icon={'shopping-bag'} label={'Purchase Order'}>
                <Link href={`/projects/${props.assignment.project?.id || ''}`} className={'underline'}>
                  {props.assignment.purchase_order?.title ?? 'N/A'}
                </Link>
              </InfoLine>
              <InfoLine icon={'square-arrow-out-up-right'} label={'Project'}>
                <Link href={`/projects/${props.assignment.project?.id || ''}`} className={'underline'}>
                  {props.assignment.project?.title ?? 'N/A'}
                </Link>
              </InfoLine>
              <InfoLine icon={'info'} label={'Type'}>
                <Badge variant={'outline'}>{props.assignment.project?.project_type?.name || 'N/A'}</Badge>
              </InfoLine>
              <InfoLine icon={'contact-round'} label={'Client'}>
                {props.assignment.project?.client?.business_name || 'N/A'}
              </InfoLine>
              <InfoLine label={'Reviewer'} icon={'user'}>
                {props.assignment.project?.client?.reviewer?.name || 'N/A'}
              </InfoLine>
              <InfoLine label={'Coordinator'} icon={'user'}>
                {props.assignment.project?.client?.coordinator?.name || 'N/A'}
              </InfoLine>
            </div>
            <Divider className={'my-2'} />
            <InfoHead>Assignee</InfoHead>
            <div>
              <InfoLine label={'Name'} icon={'square-user-round'}>
                <Badge variant={'outline'}>{props.assignment.inspector?.name || 'N/A'}</Badge>
              </InfoLine>
              <InfoLine label={'Email Address'} icon={'at-sign'}>
                <a href={`mailto:${props.assignment.inspector?.email || ''}`} className={'underline'}>
                  {props.assignment.inspector?.email || 'N/A'}
                </a>
              </InfoLine>
            </div>
            <Divider className={'my-2'} />
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.assignment.notes || 'N/A'}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}
