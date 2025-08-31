import { Badge } from '@/components/ui/badge';
import { useAssignment } from '@/providers/assignment-provider';
import { AssignmentStatus } from '@/types';
import { CheckCheckIcon, CircleDashedIcon, ClockIcon, InfoIcon, XIcon } from 'lucide-react';

export function AssignmentStatusBadge() {
  const assignment = useAssignment();

  switch (assignment!.status) {
    case AssignmentStatus.DRAFT:
      return (
        <Badge className={''} variant={'outline'}>
          <CircleDashedIcon />
          Draft
        </Badge>
      );
    case AssignmentStatus.ISSUED:
      return (
        <Badge className={'border-orange-300 bg-orange-100'} variant={'outline'}>
          <ClockIcon />
          Awaiting operation office response
        </Badge>
      );
    case AssignmentStatus.ACCEPTED:
      return (
        <Badge className={'border-green-300 bg-green-100'} variant={'outline'}>
          <CheckCheckIcon />
          Accepted
        </Badge>
      );
    case AssignmentStatus.REJECTED:
      return (
        <Badge className={'border-red-300 bg-red-100'} variant={'outline'}>
          <XIcon />
          Rejected
        </Badge>
      );
    case AssignmentStatus.ASSIGNED:
      return (
        <Badge className={'border-blue-300 bg-blue-100'} variant={'outline'}>
          <CheckCheckIcon />
          Assigned
        </Badge>
      );
    case AssignmentStatus.PARTIAL_ACKED:
      return (
        <Badge className={'border-yellow-300 bg-yellow-100'} variant={'outline'}>
          <CheckCheckIcon />
          Partially Acknowledged
        </Badge>
      );
    case AssignmentStatus.ACKED:
      return (
        <Badge className={'border-purple-300 bg-purple-100'} variant={'outline'}>
          <CheckCheckIcon />
          Inspector Acknowledged
        </Badge>
      );
    default:
      return (
        <Badge className={''} variant={'outline'}>
          <InfoIcon />
          Unknown status
        </Badge>
      );
  }
}
