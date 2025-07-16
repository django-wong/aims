import { Label } from '@/components/ui/label';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  for: string;
  renderLabel?: (props: Pick<FormFieldProps, 'label' | 'for'>) => React.ReactNode;
  error?: string|null;
}

export function VFormField({ className, ...props }: PropsWithChildren<FormFieldProps> & React.ComponentProps<'div'>) {
  return (
    <div className={cn('grid gap-3', className)}>
      {props.renderLabel ? (
        props.renderLabel(props)
      ) : (
        <div className="flex items-center">
          <Label className={'line-clamp-1'} htmlFor={props.for}>{props.label}</Label>
        </div>
      )}
      <div className={'grid gap-1'}>
        <div>{props.children}</div>
        {props.error && <div className="text-xs text-red-500">{props.error}</div>}
      </div>
    </div>
  );
}
