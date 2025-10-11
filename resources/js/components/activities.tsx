import { usePagedGetApi } from '@/hooks/use-get-api';
import { ActivityLog } from '@/types';
import { formatDateTime } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ActivitiesProps  {
  subject_type: string;
  subject_id: number;
}

export function Activities(props: ActivitiesProps) {
  const api = usePagedGetApi<ActivityLog>('/api/v1/activities', {
    searchParams: new URLSearchParams({
      subject_type: props.subject_type,
      subject_id: props.subject_id.toString(),
    })
  });

  return (
    <div>
      {
        api.data?.map((data, index) => {
          return <Activity data={data} key={'at:' + index}/>
        })
      }
    </div>
  );
}

export function Activity(props: { data: ActivityLog }) {
  return (
    <div className={'border-l-2 pl-6'}>
      <div className={'flex items-center justify-between text-sm text-muted-foreground'}>
        <div className={'flex items-center gap-2'}>
          <Avatar className="h-8 w-8 rounded-lg grayscale border">
            <AvatarImage src={props.data.causer?.avatar} alt={props.data.causer?.name ?? 'System'} />
            <AvatarFallback className="rounded-lg">
              {props.data.causer?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className={'font-bold'}>{props.data.causer?.name ?? 'System'}</span>
          {props.data.description}
        </div>
        <div>
          {formatDateTime(props.data.created_at)}
        </div>
      </div>
      <div className={'mt-1 mb-6'}>
        <div className={'bg-muted p-6 rounded mt-2 border text-sm'}>
          <pre>
            {JSON.stringify(props.data.properties, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
