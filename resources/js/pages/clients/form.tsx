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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { Circle, LocationEdit } from 'lucide-react';

const scheme = zod.object({
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
  notes: zod.string().optional()
})

export function ClientForm(props: DialogFormProps<Client>) {
  const form = useReactiveForm<Client>({
    defaultValues: props.value || undefined,
    resolver: zodResolver(scheme) as any
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
          <div className={'grid grid-cols-12 gap-4'}>
            <Form {...form}>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Business Name / Group'} for={'business_name'} error={fieldState.error?.message}>
                      <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
                    </VFormField>
                  }}
                  name={'business_name'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Contact Name'} for={'contact_name'} error={fieldState.error?.message}>
                      <Input
                        value={field.value} onChange={field.onChange} className={'bg-white'}
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
                    return <VFormField label={'Email'} for={'email'} error={fieldState.error?.message}>
                      <Input
                        placeholder={'example@mail.com'}
                        type={'email'}
                        value={field.value}
                        onChange={field.onChange}
                        className={'bg-white'}
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
                      <CoordinatorSelect
                        value={String(field.value ?? '')}
                        onValueChange={(value) => field.onChange(parseInt(value) || null)}
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
                      <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
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
                        <div className={'flex items-center gap-2  p-4 rounded-md border shadow-xs border-border bg-white'}>
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
              <div className={'col-span-12'}>
                <FormField
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Notes'} for={'notes'} error={fieldState.error?.message}>
                      <Textarea value={field.value} onChange={field.onChange} className={'bg-white min-h-[150px]'} placeholder={'Notes'}/>
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

export type CoordinatorSelectProps = PropsWithChildren<React.ComponentProps<typeof Select>>;

export function CoordinatorSelect(props: CoordinatorSelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className={'w-full bg-white'}>
        <SelectValue placeholder={'Select coordinator'}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'1'}>
          <span className={'size-5 rounded bg-muted flex justify-center items-center'}>C</span>
          Coordinator 1
        </SelectItem>
      </SelectContent>
    </Select>
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
