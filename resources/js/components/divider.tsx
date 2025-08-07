import { cn } from '@/lib/utils';

export function Divider(props: { orientation?: 'horizontal' | 'vertical', className?: string }) {
  return (
    <div
      className={cn('bg-gray-200 dark:bg-accent', props.orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full', props.className)}
    />
  );
}
