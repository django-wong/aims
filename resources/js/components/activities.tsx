import { usePagedGetApi } from '@/hooks/use-get-api';
import { ActivityLog } from '@/types';
import { formatDateTime } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Empty } from '@/components/empty';

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
    <div className={'grid grid-cols-1 gap-[1px]'}>
      {
        api.data && api.data.length > 0 ? (api.data?.map((data, index) => {
          return <Activity data={data} key={'at:' + index}/>
        })) : (
          <Empty className={'h-48'}/>
        )
      }
    </div>
  );
}

export function Activity(props: { data: ActivityLog }) {
  return (
    <div className={'border-l-4 p-4 bg-muted/50 grid grid-cols-1 gap-2 hover:border-primary hover:bg-muted transition-all'}>
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
    </div>
  )
}
