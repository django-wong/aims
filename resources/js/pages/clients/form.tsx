import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { objectToFormData, useReactiveForm, useResource } from '@/hooks/use-form';
import { Client, DialogFormProps } from '@/types';
import { FormField, Form } from '@/components/ui/form';
import { ErrorState, VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { AddressDialog, addressSchema as addressSchema } from '@/pages/projects/address-form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { Circle, LocationEdit } from 'lucide-react';
import { StaffSelect } from '@/components/user-select';
import AvatarUpload from '@/components/file-upload/avatar-upload';
import { useEffect, useState } from 'react';

const schema = zod.object({
  business_name: zod.string().min(1, 'Business name is required'),
  coordinator_id: zod.number().nullable().optional(),
  reviewer_id: zod.number().nullable().optional(),
  logo_url: zod.string().optional(),
  logo: zod.file().optional(),
  address: zod.null().or(
    addressSchema.nullable().optional()
  ),
  user: zod.object({
    name: zod.string().min(1, 'Contact name is required'),
    email: zod.string().email('Invalid email format')
  }).optional(),
  notes: zod.string().optional().nullable(),
  invoice_reminder: zod.coerce.number().min(1).max(30).nullable(),
}).superRefine((data, context) => {
  // Logo is required if no logo_url is provided
  if (!data.logo_url && !data.logo) {
    context.addIssue({
      code: 'custom',
      message: 'Logo is required',
      path: ['logo'],
    })
  }
});

export function ClientForm(props: DialogFormProps<Client>) {
  const form = useReactiveForm<zod.infer<typeof schema>, Client>({
    ...useResource('/api/v1/clients', {
      business_name: '',
      coordinator_id: null,
      reviewer_id: null,
      address: undefined,
      user: {
        name: '',
        email: ''
      },
      notes: '',
      invoice_reminder: 7,
      ...props.value,
    }),
    resolver: zodResolver(schema) as any,
    serialize: (data) => {
      return objectToFormData(data);
    }
  });

  const [open, setOpen] = useState<boolean>(props.open ?? false);

  useEffect(() => {
    if (props.open !== undefined) {
      if (props.open !== open) {
        setOpen(props.open);
      }
    }
  }, [props.open]);

  function save() {
    form.submit().then(res => {
      if (res) {
        props.onOpenChange?.(false);
        setOpen(false);
        props.onSubmit(res.data);
      }
    })
  }


  return (
    <Dialog open={open} onOpenChange={(open) => {
      props.onOpenChange?.(open);
      setOpen(open);
    }}>
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
                  control={form.control}
                  render={({field}) => (
                    <ErrorState>
                      <AvatarUpload
                        title={'Upload logo'}
                        uploadedTitle={'Logo uploaded'}
                        onFileChange={(file) => field.onChange(file?.file)}
                        defaultAvatar={props.value?.logo_url ?? undefined}
                      />
                    </ErrorState>
                  )}
                  name={'logo'}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField required label={'Business Name / Group'}>
                      <Input value={field.value} onChange={(event) => {
                        field.onChange(event);
                      }}/>
                    </VFormField>
                  }}
                  name={'business_name'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return <VFormField required label={'Contact Name'}>
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
                  render={({ field }) => {
                    return <VFormField required label={'Email'}>
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
                  render={({ field }) => {
                    return <VFormField label={'Coordinator'}>
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
                  render={({ field }) => {
                    return <VFormField label={'Reviewer'}>
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
                  render={({ field }) => {
                    return <VFormField label={'Invoice Reminder'}>
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
                  render={({ field }) => {
                    return <VFormField label={'Notes'}>
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


