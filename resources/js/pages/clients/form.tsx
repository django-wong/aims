import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PropsWithChildren, startTransition, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { useReactiveForm } from '@/hooks/use-form';
import { Address, Client, DialogFormProps } from '@/types';
import { FormField, Form } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import {
  AddressForm,
  AddressFormContext,
  AddressFormProvider,
  schema as addressSchema
} from '@/pages/projects/address-form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { Circle, LocationEdit } from 'lucide-react';
import { StaffSelect } from '@/components/user-select';

const schema = zod.object({
  business_name: zod.string().min(1, 'Business name is required'),
  coordinator_id: zod.number().nullable().optional(),
  reviewer_id: zod.number().nullable().optional(),
  address: zod.null().or(
    addressSchema.nullable().optional()
  ),
  user: zod.object({
    name: zod.string().min(1, 'Contact name is required'),
    email: zod.string().email('Invalid email format')
  }).optional(),
  notes: zod.string().optional().nullable(),
  invoice_reminder: zod.number().min(1).max(30).default(7).transform(
    (value) => {
      return value < 1 ? 1 : value > 30 ? 30 : value;
    }
  ),
});

export function ClientForm(props: DialogFormProps<Client>) {
  const form = useReactiveForm<Client>({
    defaultValues: props.value || undefined,
    resolver: zodResolver(schema) as any
  });

  useEffect(() => {
    startTransition(() => {
      form.reset(props.value || {});
      if (props.value) {
        form.setUrl(route('clients.update', {client: props.value.id}))
        form.setMethod('PATCH');
      } else {
        form.setUrl(route('clients.store'));
        form.setMethod('POST');
      }
    })
  }, [props.value]);

  function save() {
    form.submit().then(res => {
      if (res) {
        props.onOpenChange?.(false);
        props.onSubmit(form.getValues());
      }
    })
  }


  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client</DialogTitle>
          <DialogDescription>Fill in the details below to create or update the client.</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <div className={'grid grid-cols-12 gap-6'}>
            <Form {...form}>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField  required label={'Business Name / Group'} for={'business_name'} error={fieldState.error?.message}>
                      <Input value={field.value} onChange={field.onChange}/>
                    </VFormField>
                  }}
                  name={'business_name'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return <VFormField required label={'Contact Name'} for={'contact_name'} error={fieldState.error?.message}>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={'Contact Name'}
                      />
                    </VFormField>
                  }}
                  name={'user.name'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return <VFormField required label={'Email'} for={'email'} error={fieldState.error?.message}>
                      <Input
                        placeholder={'example@mail.com'}
                        type={'email'}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </VFormField>
                  }}
                  name={'user.email'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Coordinator'} for={'coordinator_id'} error={fieldState.error?.message}>
                      <StaffSelect
                        value={field.value}
                        onValueChane={(value) => field.onChange(value)}
                      />
                    </VFormField>
                  }}
                  name={'coordinator_id'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Reviewer'} for={'reviewer_id'} error={fieldState.error?.message}>
                      <StaffSelect
                        value={field.value}
                        onValueChane={(value) => field.onChange(value)}
                      />
                    </VFormField>
                  }}
                  name={'reviewer_id'}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  name={'address'}
                  render={({field}) => {
                    return (
                      <VFormField
                        label={'Address'}
                        for={'address'}
                      >
                        <div className={'flex items-center gap-2  p-4 rounded-md border shadow-xs border-border bg-background'}>
                          <div className={'text-sm flex-1'}>
                            {field.value?.address_line_1 ? (
                              <>
                                <p>{field.value?.address_line_1}</p>
                                <p>
                                  {field.value?.city}, {field.value?.state}, {field.value?.zip}, {field.value?.country}
                                </p>
                              </>
                            ) : (
                              <p className={'text-muted-foreground'}>No address provided</p>
                            )}
                          </div>
                          <AddressDialog value={field.value} onChange={field.onChange}>
                            <Button variant={'secondary'} size={'sm'}>
                              <LocationEdit/> Edit Address
                            </Button>
                          </AddressDialog>
                        </div>
                      </VFormField>
                    );
                  }}
                />
              </div>
              <div className={'col-span-4'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Invoice Reminder'} for={'invoice_reminder'} error={fieldState.error?.message}>
                      <Input
                        type={'number'}
                        min={1}
                        max={30}
                        value={field.value}
                        onChange={(event) => field.onChange(parseInt(event.target.value))}
                        placeholder={'in Days'}
                      />
                    </VFormField>
                  }}
                  name={'invoice_reminder'}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Notes'} for={'notes'} error={fieldState.error?.message}>
                      <Textarea value={field.value} onChange={field.onChange} className={'min-h-[150px]'} placeholder={'Notes'}/>
                    </VFormField>
                  }}
                  name={'notes'}
                />
              </div>
            </Form>
          </div>
        </DialogInnerContent>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} type={'button'}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={form.submitDisabled} onClick={save}>
            {form.formState.isSubmitting ? (<Circle className={'animate-spin'}/>) : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddressDialog(props: PropsWithChildren<{
  value?: Address|null;
  onChange: (value: Address | null) => void;
}>) {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      {props.children}
    </DialogTrigger>
    <DialogContent>
      <AddressFormProvider value={props.value || null}>
        <DialogHeader>
          <DialogTitle>Address</DialogTitle>
          <DialogDescription>You can fill in the address manually, or use the location finder.</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <div className={'grid grid-cols-12 gap-4 items-start'}>
            <AddressForm/>
          </div>
        </DialogInnerContent>
        <DialogFooter>
          <DialogClose asChild>
            <AddressFormContext.Consumer>
              {(form) => {
                return <>
                  <Button
                    type={'button'}
                    onClick={() => {
                      form?.validate((data) => {
                        if (data) {
                          props.onChange(data);
                          setOpen(false);
                        }
                      }, (err) => {
                        console.info(err);
                      })
                    }}>
                    Save
                  </Button>
                </>
              }}
            </AddressFormContext.Consumer>
          </DialogClose>
        </DialogFooter>
      </AddressFormProvider>
    </DialogContent>
  </Dialog>;
}
