import { Badge } from '@/components/ui/badge';

interface CloseDateProps {
  close_date: string | null;
}

export function CloseDate(props: CloseDateProps) {
  if (props.close_date) {
    return <Badge variant={'outline'}>Closed</Badge>
  }
  return <Badge>Open</Badge>
}
