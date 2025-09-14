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
      <h4 className={'text-muted-foreground flex justify-start gap-1 items-center flex-shrink-0 origin-left scale-90'}>
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
    <div className={cn(`transition-all hover:bg-muted/60 hover:rounded-sm -mx-2 px-2 py-1 flex justify-between items-start gap-2 flex-wrap`, className)}>
      <InfoLineLabel icon={icon}>
        {label}
      </InfoLineLabel>
      <InfoLineValue className={'flex justify-end text-right'}>
        {children}
      </InfoLineValue>
    </div>
  );
}
