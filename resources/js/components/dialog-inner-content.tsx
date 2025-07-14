import { PropsWithChildren } from 'react';

interface DialogInnerContentProps {
  className?: string;
}

export function DialogInnerContent(props: PropsWithChildren<DialogInnerContentProps>) {
  return (
    <div className={'-mx-6'}>
      <div className={`bg-slate-100 border-y p-6 ${props.className || ''}`}>
        <div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
