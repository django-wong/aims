import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';

export interface DialogWrapperProps extends React.ComponentProps<'div'> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogWrapper(props: DialogWrapperProps) {
  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent className={props.className}>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.description && <DialogDescription>{props.description}</DialogDescription>}
          </DialogHeader>
          <DialogInnerContent>
            {props.children}
          </DialogInnerContent>
          <DialogFooter>
            {props.footer || (
              <>
                <DialogClose asChild>
                  <Button variant={'outline'}>Close</Button>
                </DialogClose>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
