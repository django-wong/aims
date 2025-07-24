import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface DialogInnerContentProps {
  className?: string;
}

export function DialogInnerContent(props: PropsWithChildren<DialogInnerContentProps>) {
  return (
    <div className={'-mx-6'}>
      <div className={cn('bg-muted dark:bg-black border-y p-6 max-h-[calc(100vh-230px)] overflow-y-auto', props.className)}>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
