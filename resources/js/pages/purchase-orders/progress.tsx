import { Progress } from '@/components/ui/progress';

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    <Progress className={status} style={{'--color-primary': color}} value={props.value * 100}/>
  );
}
