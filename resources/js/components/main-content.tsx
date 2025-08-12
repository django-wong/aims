import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';
import { Divider } from '@/components/divider';

export function MainContent({ children, className }: ComponentProps<'div'>) {
  return (
    <>
      <div className={cn('bg-secondary/20 flex flex-1 border-t', className)}>{children}</div>
    </>
  );
}

export function MainContentBlock({ children, className }: ComponentProps<'div'>) {
  return (
    <>
      <div className={cn('p-6 overflow-hidden', className)}>{children}</div>
    </>
  );
}

interface TwoColumnLayout73Props {
  left: React.ReactNode;
  right: React.ReactNode,
  className?: string
}

export function TwoColumnLayout73({ left, right, className }: TwoColumnLayout73Props) {
  return (
    <MainContent className={cn('flex-col-reverse justify-end lg:flex-row lg:justify-start', className)}>
      <MainContentBlock className={'lg:flex-grow'}>{left}</MainContentBlock>
      <Divider orientation={'vertical'} className={'hidden lg:inline-block shrink-0'}/>
      <Divider orientation={'horizontal'} className={'inline-block lg:hidden shrink-0'}/>
      <MainContentBlock className={'shrink-0 lg:min-w-[400px] lg:max-w-[500px] bg-background'}>{right}</MainContentBlock>
    </MainContent>
  );
}
