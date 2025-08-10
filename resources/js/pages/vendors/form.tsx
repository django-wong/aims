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
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { Textarea } from '@/components/ui/textarea';
const schema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  business_name: zod.string().min(1, 'Business name is required'),
  notes: zod.string().optional(),
});

export function VendorForm(props: DialogFormProps<Vendor>) {
  const form = useReactiveForm<zod.infer<typeof schema>, Vendor>({
    url: '/api/v1/vendors',
    resolver: zodResolver(schema)
  });

  function save() {
    form.submit().then((response) => {
      if (response) {
        props.onSubmit(response.data);
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
                <FormField
                  control={form.control}
                  render={({field}) => (
                    <VFormField required label={'Name'}>
                      <Input {...field}/>
                    </VFormField>
                  )}
                  name={'name'}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  render={({field}) => (
                    <VFormField required label={'Business Name'}>
                      <Input {...field}/>
                    </VFormField>
                  )}
                  name={'business_name'}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  name={'notes'}
                  render={({field}) => (
                    <VFormField label={'Notes'}>
                      <Textarea className={'bg-background min-h-[200px]'} {...field}/>
                    </VFormField>
                  )}
                />
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
