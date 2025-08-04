import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Divider } from '@/components/divider';

export function MainContent({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-1 border-t', className)}>
    {children}
  </div>;
}

export function MainContentBlock({ children, className }: ComponentProps<'div'>) {
  return <div className={cn('p-6', className)}>
    {children}
  </div>;
}

export function TwoColumnLayout73({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return <MainContent className={'flex-col-reverse lg:flex-row'}>
        <MainContentBlock className={'flex-1'}>
          {left}
        </MainContentBlock>
        <Divider orientation={'vertical'} />
        <MainContentBlock className={'w-full lg:w-md'}>
          {right}
        </MainContentBlock>
      </MainContent>;
}
