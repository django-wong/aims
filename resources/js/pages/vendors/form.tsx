import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DialogFormProps, Vendor } from '@/types';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import { Circle } from 'lucide-react';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { Textarea } from '@/components/ui/textarea';
const schema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  business_name: zod.string().min(1, 'Business name is required'),
  notes: zod.string().optional(),
});

export function VendorForm(props: DialogFormProps<Vendor>) {
  const form = useReactiveForm<zod.infer<typeof schema>>({
    url: '/api/v1/vendors',
    resolver: zodResolver(schema)
  });

  function save() {
    form.submit().then((response) => {
      if (response && response.ok) {
        response.json().then((data) => {
          props.onSubmit(data);
        });
      } else {
        console.error('Failed to save vendor');
      }
    })
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vendor</DialogTitle>
          <DialogDescription>Fill in the details below to create or update the vendor.</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <Form {...form}>
            <div className={'grid grid-cols-12 gap-4'}>
              <div className={'col-span-12'}>
                <VFormField required label={'Name'} for={'name'} error={form.formState.errors.name?.message}>
                  <Input className={'bg-background'} {...form.register('name')}/>
                </VFormField>
              </div>
              <div className={'col-span-12'}>
                <VFormField required label={'Business Name'} for={'business_name'} error={form.formState.errors.business_name?.message}>
                  <Input className={'bg-background'} {...form.register('business_name')}/>
                </VFormField>
              </div>
              <div className={'col-span-12'}>
                <VFormField label={'Notes'} for={'notes'} error={form.formState.errors.notes?.message}>
                  <Textarea className={'bg-background min-h-[200px]'} {...form.register('notes')}/>
                </VFormField>
              </div>
            </div>
          </Form>
        </DialogInnerContent>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} type={'button'}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={form.submitDisabled} onClick={save}>
            {form.formState.isSubmitting ? <Circle className={'animate-spin'} /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
