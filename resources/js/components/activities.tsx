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

  if (api.data && api.data.length > 0) {
    return (
      <div className={'grid grid-cols-1 gap-8 activity-list'}>
        {
          api.data?.map((data, index) => {
            return <Activity data={data} key={'at:' + index}/>
          })
        }
      </div>
    );
  }

  return <Empty className={'h-48'}/>;
}

export function Activity(props: { data: ActivityLog }) {
  return (
    <div className={'flex items-start gap-4'}>
      <Avatar className="h-8 w-8 rounded-lg grayscale border">
        <AvatarImage src={props.data.causer?.avatar} alt={props.data.causer?.name ?? 'System'} />
        <AvatarFallback className="rounded-lg">
          {props.data.causer?.name.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className={'flex-1 pt-1'}>
        <div className={'flex justify-between line-clamp-1 items-center flex-wrap'}>
          <div className={'text-sm text-muted-foreground'}>
            {props.data.causer?.name ?? 'System'}
          </div>
          <span className={'text-xs text-muted-foreground whitespace-nowrap'}>
            {formatDateTime(props.data.created_at)}
          </span>
        </div>
        <div>{props.data.description}</div>
      </div>

    </div>
  )
}
