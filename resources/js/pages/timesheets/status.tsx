import { Badge } from '@/components/ui/badge';
import { Timesheet } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckIcon, CircleDashedIcon, LoaderCircleIcon, XIcon } from 'lucide-react';
import { useTimesheet } from '@/providers/timesheet-provider';

export function TimesheetStatus() {
  const timesheet = useTimesheet();

  if (!timesheet) {
    return null;
  }

  switch (timesheet.status) {
    case 0:
      return (
        <StatusExplanation status={timesheet.status}>
          <Badge variant="outline" className={'bg-gray-100'}>
            Draft <RejectionBadge/>
          </Badge>
        </StatusExplanation>
      );
    case 1:
      return (
        <StatusExplanation status={timesheet.status}>
          <Badge variant="outline" className={'bg-yellow-50 border-yellow-200'}>
            Reviewing <RejectionBadge/>
          </Badge>
        </StatusExplanation>
      );
    case 2:
      return (
        <StatusExplanation status={timesheet.status}>
          <Badge variant="outline" className={'bg-blue-50 border-blue-200'}>
            Waiting for Client <RejectionBadge/>
          </Badge>
        </StatusExplanation>
      );
    case 3:
      return (
        <StatusExplanation status={timesheet.status}>
          <Badge variant="outline" className={'bg-purple-50 border-purple-200'}>
            Client Approved <RejectionBadge/>
          </Badge>
        </StatusExplanation>
      );
    case 4:
      return (
        <StatusExplanation status={timesheet.status}>
          <Badge variant="outline" className={'bg-green-50 border-green-200'}>
            Invoiced
          </Badge>
        </StatusExplanation>
      );
    default:
      return (
        <StatusExplanation status={timesheet.status}>
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
        <div className={'flex items-center gap-1'}>
          <StatusMinimal status={props.status} mininal={0}/>
          Inspector Submit
        </div>
        <div className={'flex items-center gap-1'}>
          <StatusMinimal status={props.status} mininal={1}/>
          Reviewed
        </div>
        <div className={'flex items-center gap-1'}>
          <StatusMinimal status={props.status} mininal={2}/>
          Client Approved
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function StatusMinimal(props: {status: Timesheet['status'], mininal: Timesheet['status']}) {
  const timesheet = useTimesheet();

  const size = 12;


  if (props.status > props.mininal) {
    return (
      <CheckIcon size={size} />
    )
  }

  if (timesheet?.rejected) {
    if (props.mininal > props.status) {
      if (props.status == props.mininal - 1) {
        return (
          <XIcon size={size} />
        )
      }

      // return <XIcon size={size} className={'text-red-500'} />;
    }
  }

  if (props.status === props.mininal) {
    return <LoaderCircleIcon size={size} className={'animate-spin'} />
  }

  return <CircleDashedIcon size={size} />
}

export function RejectionBadge() {
  const timesheet = useTimesheet();

  if (timesheet?.rejected) {
    return (
      <span className={'cursor-help'} title={timesheet.rejection_reason ?? ''}>
        [Rejected]
      </span>
    );
  }
  return null;
}
