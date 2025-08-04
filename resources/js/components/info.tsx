import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { PropsWithChildren } from 'react';

export function Info(props: PropsWithChildren) {
  return (
    <>
      <div className={'flex flex-col gap-2'}>{props.children}</div>
    </>
  );
}

export function InfoHead({ children }: PropsWithChildren) {
  return (
    <h3 className={'font-bold text-lg flex justify-between items-center'}>
      {children}
    </h3>
  );
}

export function InfoLineLabel({ children, icon }: PropsWithChildren<{icon?: IconName}>) {
  return (
    <>
      <h4 className={'text-muted-foreground flex justify-start gap-1 items-center text-sm flex-shrink-0'}>
        { icon ? (
          <DynamicIcon name={icon} className={'w-4 h-4 mr-1'} />
        ) : null}
        {children}
      </h4>
    </>
  );
}

export function InfoLineValue(props: PropsWithChildren) {
  return (
    <div className={'flex justify-end items-center gap-2 flex-1'}>
      {props.children}
    </div>
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
    <div className={`flex justify-between items-center gap-2 ${className} flex-wrap min-h-8`}>
      <InfoLineLabel icon={icon}>
        {label}
      </InfoLineLabel>
      <InfoLineValue>
        {children}
      </InfoLineValue>
    </div>
  );
}
