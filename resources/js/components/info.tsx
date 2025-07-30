import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { PropsWithChildren } from 'react';

export function Info(props: PropsWithChildren) {
  return (
    <>
      <div className={'flex flex-col gap-4'}>{props.children}</div>
    </>
  );
}

export function InfoHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className={'font-bold text-lg'}>
      {children}
    </h3>
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
    <div className={`flex justify-between items-center gap-8 ${className}`}>
      <h4 className={'text-muted-foreground/80 flex justify-start gap-1 items-center'}>
        { icon ? (
          <DynamicIcon name={icon} className={'w-4 h-4'} />
        ) : null}
        {label}
      </h4>
      <div className={'flex justify-end items-center gap-2'}>
        {children}
      </div>
    </div>
  );
}
