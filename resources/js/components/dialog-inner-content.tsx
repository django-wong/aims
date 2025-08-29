import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface DialogInnerContentProps {
  className?: string;
}

export function DialogInnerContent(props: PropsWithChildren<DialogInnerContentProps>) {
  return (
    <div className={'-mx-6 overflow-hidden'}>
      <div className={cn('bg-secondary/20 dark:bg-black border-y p-6 max-h-[calc(100vh-430px)] md:max-h-[calc(100vh-200px)] overflow-y-auto', props.className)}>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
