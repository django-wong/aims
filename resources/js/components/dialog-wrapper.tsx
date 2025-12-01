import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogPortal, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';

export {
  DialogClose
}

export interface DialogWrapperProps extends React.ComponentProps<typeof DialogContent> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  innerContentClassName?: string;
}

export function DialogWrapper({ trigger, title, description, footer, open, onOpenChange, innerContentClassName,...props }: DialogWrapperProps) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogPortal>
          <DialogContent {...props}>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogInnerContent className={innerContentClassName}>{props.children}</DialogInnerContent>
            <DialogFooter>
              {footer || (
                <DialogClose asChild>
                  <Button variant={'outline'}>Close</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
