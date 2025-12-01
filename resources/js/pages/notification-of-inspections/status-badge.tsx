import { Badge } from '@/components/ui/badge';
import { useIsClient } from '@/hooks/use-role';

interface NotificationOfInspectionStatusBadgeProps {
  status: number;
}

export function NotificationOfInspectionStatusBadge({status}: NotificationOfInspectionStatusBadgeProps) {
  const is_client = useIsClient();

  const mapping = [
    [0, 'Draft', '#ddd', '#dddddd50'],
    [1, is_client ? 'Sent' : 'Pending', '#4caf50', '#4caf5050'],
    [2, 'Accepted', '#2196f3', '#2196f350'],
    [3, 'Rejected', '#9c27b0', '#9c27b050'],
    [4, 'Client Rejected', '#ff9800', '#ff980050'],
    [5, 'Client Accepted', '#607d8b', '#607d8b70'],
  ];

  const found = mapping.find(([s]) => s === status);

  if (!found) return null;

  const [, label, color, fillColor] = found;

  return (
    <Badge className={'bg-primary'} style={{'--color-border': color, '--color-primary': fillColor} as any} variant={'outline'}>{label}</Badge>
  );
}
