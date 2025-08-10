import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label?: string;
  for?: string;
  renderLabel?: (props: Pick<FormFieldProps, 'label' | 'for'>) => React.ReactNode;
  error?: string | null;
  required?: boolean;
  description?: string;
}

export function VFormField({ className, ...props }: PropsWithChildren<FormFieldProps> & React.ComponentProps<'div'>) {
  return (
    // <>
    //   <div className={cn('flex flex-col justify-start gap-2 w-full', className)}>
    //     {props.renderLabel ? (
    //       props.renderLabel(props)
    //     ) : (
    //       props.label ? (<div className="flex items-center justify-start">
    //         <Label className={'line-clamp-1 text-foreground text-sm leading-4 font-medium'}>
    //           {props.label}
    //           {props.required && <span className="text-red-500">&nbsp;*</span>}
    //         </Label>
    //       </div>) : null
    //     )}
    //     <div className={cn('grid gap-1 w-full', props.error ? 'has-error' : '')}>
    //       {props.children}
    //       {props.error && <div className="text-xs text-red-500">{props.error}</div>}
    //     </div>
    //   </div>
    // </>
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
