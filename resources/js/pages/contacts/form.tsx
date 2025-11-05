import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { DialogFormProps, Contact } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import zod from 'zod';
import { useActionState, useOptimistic } from 'react';

type ContactFormProps = DialogFormProps<Contact> & {
  contactable_id?: number;
  contactable_type?: string;
};

const schema = zod.object({
  first_name: zod.string().min(1),
  last_name: zod.string().min(1),
  title: zod.string().optional().nullable(),
  email: zod.email().optional().nullable().or(zod.literal('')),
  mobile: zod.string().optional().nullable(),
  phone: zod.string().optional().nullable(),
  company: zod.string().optional().nullable(),
  website: zod.string().url().optional().nullable().or(zod.literal('')),
  business_type: zod.string().optional().nullable(),
  notes: zod.string().optional().nullable(),
  contactable_id: zod.number().optional(),
  contactable_type: zod.string().optional(),
});

export function ContactForm(props: ContactFormProps) {
  const [open, setOpen] = useActionState((state: boolean, value: boolean) => {
    props.onOpenChange?.(value);
    return value;
  }, props.open ?? false);

  const form = useReactiveForm<zod.infer<typeof schema>, Contact>({
    ...useResource('/api/v1/contacts', {
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      mobile: '',
      phone: '',
      company: '',
      website: '',
      business_type: '',
      notes: '',
      contactable_id: props.contactable_id,
      contactable_type: props.contactable_type,
      ...props.value
    }),
    resolver: zodResolver(schema),
  });

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        props.onSubmit?.(response.data);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {props.children && <DialogTrigger asChild={props.asChild === undefined ? true : props.asChild}>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact</DialogTitle>
            <DialogDescription>Fill in the details below to create or update the contact.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <form>
              <div className={'grid grid-cols-12 gap-6'}>
                <Form {...form}>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Title'}>
                            <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'Mr, Ms, Dr, etc.'} />
                          </VFormField>
                        );
                      }}
                      name={'title'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'First Name'}>
                            <Input value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'first_name'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Last Name'}>
                            <Input value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'last_name'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Email'}>
                            <Input autoComplete={'email'} placeholder={'example@mail.com'} type={'email'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'email'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Mobile'}>
                            <Input type={'tel'} placeholder={'(555) 123-4567'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'mobile'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Phone'}>
                            <Input type={'tel'} placeholder={'(555) 123-4567'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'phone'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Company'}>
                            <Input placeholder={'Company name'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'company'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Website'}>
                            <Input type={'url'} placeholder={'https://example.com'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'website'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Business Type'}>
                            <Input placeholder={'client, vendor, contractor, etc.'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'business_type'}
                    />
                  </div>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Notes'}>
                            <Textarea placeholder={'Additional notes about this contact...'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'notes'}
                    />
                  </div>
                </Form>
              </div>
            </form>
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
    </>
  );
}
