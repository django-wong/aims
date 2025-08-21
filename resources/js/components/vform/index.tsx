import { FormControl, FormDescription, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  renderLabel?: (props: FormFieldProps) => React.ReactNode;
  required?: boolean;
  description?: string;
  error?: string | React.ReactNode;
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
        <FormMessage children={props.error} />
      </FormItem>
    </>
  );
}

export function ErrorState(props: React.ComponentProps<'div'>) {
  const { error } = useFormField()

  return (
    <div className={cn('contents', !!error && 'text-destructive')}>
      {props.children}
    </div>
  );
}
