import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PropsWithChildren } from 'react';

interface FormFieldProps {
  label?: string;
  renderLabel?: (props: FormFieldProps) => React.ReactNode;
  required?: boolean;
  description?: string;
}

export function VFormField({ className, ...props }: PropsWithChildren<FormFieldProps> & React.ComponentProps<'div'>) {
  return (
    <>
      <FormItem className={className}>
        {typeof props.renderLabel === 'function' ? (
          props.renderLabel(props)
        ) : props.label ? (
          <>
            <FormLabel>
              <div>
                {props.label}
                {props.required && <span className={'text-red-500'}>&nbsp;*</span>}
              </div>
            </FormLabel>
          </>
        ) : null}
        <FormControl>
          {props.children}
        </FormControl>
        {props.description && <FormDescription>{props.description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </>
  );
}
