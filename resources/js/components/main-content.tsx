import { Divider } from '@/components/divider';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export function MainContent({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 border-t bg-muted/50', className)}>{children}</div>;
}

export function MainContentBlock({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function TwoColumnLayout73({ left, right, className }: { left: React.ReactNode; right: React.ReactNode, className?: string }) {
  return (
    <MainContent className={cn('flex-col-reverse lg:flex-row relative', className)}>
      <MainContentBlock className={'flex-1'}>{left}</MainContentBlock>
      <Divider orientation={'vertical'} className={'hidden lg:block'}/>
      <Divider className={'block lg:hidden'}/>
      <MainContentBlock className={'w-full lg:w-md'}>{right}</MainContentBlock>
    </MainContent>
  );
}
