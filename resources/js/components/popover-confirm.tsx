import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import * as PopoverPrimitive from "@radix-ui/react-popover"

interface PopoverConfirmProps {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  message: string | React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  asChild?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export function PopoverConfirm(props: PopoverConfirmProps) {
  return (
    <>
      <Popover open={props.open} onOpenChange={props.onOpenChange}>
        <PopoverTrigger asChild={props.asChild}>{props.children}</PopoverTrigger>
        <PopoverPrimitive.Portal>
          <PopoverContent side={props.side} align={props.align} className="w-80">
            <div className={'grid gap-4'}>
              <div className={'space-y-2'}>
                <h4 className={'leading-none font-medium'}>{props.title || 'Are you sure'}</h4>
                <p className={'text-muted-foreground text-sm'}>{props.message}</p>
              </div>
              <div className={'flex justify-end gap-2'}>
                <PopoverPrimitive.Close asChild>
                  <Button variant={'outline'} size={'sm'}>Cancel</Button>
                </PopoverPrimitive.Close>
                <PopoverPrimitive.Close asChild>
                  <Button onClick={props.onConfirm} size={'sm'}>{props.confirmText || 'Confirm'}</Button>
                </PopoverPrimitive.Close>
              </div>
            </div>
          </PopoverContent>
        </PopoverPrimitive.Portal>
      </Popover>
    </>
  );
}
