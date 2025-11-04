import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProgressProps {
  value: number; // value between 0 and 1
}

export function PurchaseOrderProgress(props: ProgressProps) {
  let color = '#4bd852';
  let status = 'on-track';

  if (props.value > 0.9) {
    color = '#f87171';
    status = 'over-budget';
  } else if (props.value > 0.7) {
    color = '#fbbf24';
    status = 'at-risk';
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Progress className={status} style={{'--color-primary': color} as any} value={props.value * 100}/>
      </TooltipTrigger>
      <TooltipContent>
        {Math.round(props.value * 100)}% used
      </TooltipContent>
    </Tooltip>
  );
}
