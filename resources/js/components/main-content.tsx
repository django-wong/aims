import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function MainContent({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 border-t bg-accent', className)}>
    {children}
  </div>;
}

export function MainContentBlock({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('p-6', className)}>
    {children}
  </div>;
}
