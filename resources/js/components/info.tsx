import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { ComponentProps, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Info({ children, ...props }: ComponentProps<'div'>) {
  return (
    <>
      <div className={'flex flex-col gap-4'} {...props}>
        {children}
      </div>
    </>
  );
}

export function InfoHead({ children, right }: PropsWithChildren<{right?: React.ReactNode}>) {
  return (
    <h3 className={'font-bold text-lg flex justify-between items-center'}>
      <span>{children}</span>
      {/* Right side content can be added here if needed */}
      {right}
    </h3>
  );
}

export function InfoLineLabel({ children, icon }: PropsWithChildren<{icon?: IconName}>) {
  return (
    <>
      <h4 className={'text-muted-foreground flex justify-start gap-1 items-center text-sm flex-shrink-0 mt-[0.125rem]'}>
        { icon ? (
          <DynamicIcon name={icon} className={'w-4 h-4 mr-1'} />
        ) : null}
        {children}
      </h4>
    </>
  );
}

export function InfoLineValue({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex justify-end items-center gap-2 flex-1', className)} {...props}/>
  );
}

export function InfoLine({
  icon,
  label,
  children,
  className = '',
}: {
  icon?: IconName;
  label: string | React.ReactNode;
  children: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex justify-between items-start gap-2 ${className} flex-wrap min-h-8`}>
      <InfoLineLabel icon={icon}>
        {label}
      </InfoLineLabel>
      <InfoLineValue className={'text-right'}>
        {children}
      </InfoLineValue>
    </div>
  );
}
