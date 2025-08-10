import { cn } from '@/lib/utils';

export function Divider(props: { orientation?: 'horizontal' | 'vertical', className?: string }) {
  return (
    <div
      className={cn('bg-gray-200 dark:bg-accent', props.orientation === 'vertical' ? 'w-[1px] min-h-full' : 'h-[1px] min-w-full', props.className)}
    />
  );
}
