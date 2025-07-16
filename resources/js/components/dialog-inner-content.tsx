import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface DialogInnerContentProps {
  className?: string;
}

export function DialogInnerContent(props: PropsWithChildren<DialogInnerContentProps>) {
  return (
    <div className={'-mx-6'}>
      <div className={cn('bg-slate-100 dark:bg-black border-y p-6', props.className)}>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
