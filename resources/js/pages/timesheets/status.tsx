import { Badge } from '@/components/ui/badge';
import { Timesheet } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckIcon, CircleDashedIcon } from 'lucide-react';

export function TimesheetStatus(props: { status: Timesheet['status'] }) {
  switch (props.status) {
    case 0:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-gray-100'}>
            Draft
          </Badge>
        </StatusExplanation>
      );
    case 1:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-yellow-50 border-yellow-200'}>
            Reviewing
          </Badge>
        </StatusExplanation>
      );
    case 2:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-blue-50 border-blue-200'}>
            Waiting for Contract Holder Approval
          </Badge>
        </StatusExplanation>
      );
    case 3:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-purple-50 border-purple-200'}>
            Waiting for Client Approval
          </Badge>
        </StatusExplanation>
      );
    case 4:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-green-50 border-green-200'}>
            Client Approved
          </Badge>
        </StatusExplanation>
      );
    case 5:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-teal-50 border-teal-200'}>
            Invoiced
          </Badge>
        </StatusExplanation>
      );
    default:
      return (
        <StatusExplanation status={props.status}>
          <Badge variant="outline" className={'bg-red-50 border-red-200'}>
            Unknown Status
          </Badge>
        </StatusExplanation>
      );
  }
}

interface StatusExplanationProps {
  children?: React.ReactNode;
  status: Timesheet['status'];
}

export function StatusExplanation(props: StatusExplanationProps) {
  return (
    <Tooltip>
      <TooltipTrigger>{props.children}</TooltipTrigger>
      <TooltipContent side={'top'} align={'start'} className={'grid gap-2'}>
        <div className={'flex items-center gap-1'}> <StatusMinimal status={props.status} mininal={0}/> Inspector Submit</div>
        <div className={'flex items-center gap-1'}> <StatusMinimal status={props.status} mininal={1}/> Reviewed</div>
        <div className={'flex items-center gap-1'}> <StatusMinimal status={props.status} mininal={2}/> Contract holder approved</div>
        <div className={'flex items-center gap-1'}> <StatusMinimal status={props.status} mininal={3}/> Client Approved</div>
      </TooltipContent>
    </Tooltip>
  );
}

export function StatusMinimal(props: {status: Timesheet['status'], mininal: Timesheet['status']}) {
  const size = 12;

  if (props.status > props.mininal) {
    return (
      <CheckIcon size={size} />
    )
  }
  return <CircleDashedIcon size={size} />
}
