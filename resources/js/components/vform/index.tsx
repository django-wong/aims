import { Label } from '@/components/ui/label';
import { PropsWithChildren } from 'react';

interface FormFieldProps {
  label: string;
  for: string;
  renderLabel?: (props: Pick<FormFieldProps, 'label' | 'for'>) => React.ReactNode;
  error?: string|null;
}

export function VFormField(props: PropsWithChildren<FormFieldProps>) {
  return (
    <div className="grid gap-3">
      {props.renderLabel ? (
        props.renderLabel(props)
      ) : (
      <div className="flex items-center">
        <Label htmlFor={props.for}>{props.label}</Label>
      </div>
      )}
      <div className={'grid gap-1'}>
        <div>{props.children}</div>
        {props.error && <div className="text-red-500 text-xs">
          {props.error}
        </div>}
      </div>
    </div>
  );
}
