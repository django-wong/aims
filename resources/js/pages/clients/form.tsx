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
import z from 'zod';
import { Circle, LocationEdit, MailIcon } from 'lucide-react';
import { StaffSelect } from '@/components/user-select';
import AvatarUpload from '@/components/file-upload/avatar-upload';
import { useEffect, useState } from 'react';
import { QuickNewStaffButton } from '@/pages/clients/quick-new-staff-button';
import zod from 'zod';
import { Badge } from '@/components/ui/badge';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

const schema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  client_group: z.string(),
  code: z.string(),
  billing_name: z.string().max(255).min(1).optional().nullable(),
  billing_address: z.string().max(255).min(1).optional().nullable(),
  coordinator_id: z.number().optional().nullable(),
  reviewer_id: z.number().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  logo: z.file().optional(),
  address: z.null().or(
    addressSchema.nullable().optional()
  ),
  user: z.object({
    name: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email format'),
    password: zod.string().min(6).optional().nullable(),
    password_confirmation: zod.string().optional().nullable(),
  }).optional(),
  notes: z.string().optional().nullable(),
  invoice_reminder: z.coerce.number().min(1).max(30).nullable(),
  email: z.email().optional().nullable(),
  notification_recipients: z.array(z.email()).nullable()
});

export function ClientForm(props: DialogFormProps<Client>) {
  const form = useReactiveForm<z.infer<typeof schema>, Client>({
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

  const isUpdate = !!props.value;

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
        props.onSubmit?.(res.data);
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
                    return <VFormField required label={'Business Name'}>
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
                  render={({ field }) => {
                    return <VFormField required label={'Group'}>
                      <Input value={field.value} onChange={(event) => {
                        field.onChange(event);
                      }}/>
                    </VFormField>
                  }}
                  name={'client_group'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField required label={'Code'}>
                      <Input value={field.value} onChange={(event) => {
                        field.onChange(event);
                      }}/>
                    </VFormField>
                  }}
                  name={'code'}
                />
              </div>
              <div className={'col-span-12'}>
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
              <div className={'col-span-12'}>
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
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField required={!isUpdate} label={'Password'}>
                        <Input autoComplete={'new-password'} placeholder={isUpdate ? 'Leave blank to retain existing password' : ''} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                      </VFormField>
                    );
                  }}
                  name={'user.password'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField required={!isUpdate} label={'Confirm Password'}>
                        <Input autoComplete={'new-password'} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                      </VFormField>
                    );
                  }}
                  name={'user.password_confirmation'}
                />
              </div>
              <div className={'col-span-6'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField label={'Coordinator'}>
                      <StaffSelect
                        value={field.value}
                        onValueChane={(value) => field.onChange(value)}
                        createButton={
                          <QuickNewStaffButton/>
                        }
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
                        createButton={
                          <QuickNewStaffButton/>
                        }
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
              <div className={'col-span-12 grid grid-cols-1 gap-2'}>
                <FormField
                  name={'email'}
                  control={form.control}
                  render={({field}) => {
                    return (
                      <VFormField label={'Notification Recipients'}>
                        <InputGroup>
                          <InputGroupInput value={field.value ?? ''} onChange={field.onChange} onKeyPress={async (e) => {
                            if (e.key === 'Enter') {
                              if (await form.trigger('email')) {
                                const {
                                  email, notification_recipients
                                } = form.getValues();
                                if (email) {
                                  const current = notification_recipients || [];
                                  if (!current.includes(email)) {
                                    form.setValue('notification_recipients', [...current, email]);
                                  }
                                  form.setValue('email', undefined);
                                }
                              }
                            }
                          }} placeholder={'Type email and press enter to add'}/>
                          <InputGroupAddon>
                            <MailIcon/>
                          </InputGroupAddon>
                        </InputGroup>
                      </VFormField>
                    );
                  }}
                />
                <FormField
                  name={'notification_recipients'}
                  control={form.control}
                  render={({field}) => {
                    return (
                      <div className={'flex flex-wrap gap-2'}>
                        {(field.value ?? []).map((email) => (
                          <Badge key={email} className={'flex items-center'}>
                            <span>{email}</span>
                            <button type={'button'} onClick={() => {
                              field.onChange((field.value ?? []).filter(e => e !== email));
                            }}>
                              &times;
                            </button>
                          </Badge>
                        ))}
                      </div>
                    );
                  }}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return <VFormField label={'Invoice Reminder'} description={'System will send reminder to client if no action was taken within the set days'}>
                      <Input
                        type={'number'}
                        min={1}
                        max={30}
                        value={field.value ?? ''}
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
                  control={form.control}
                  name={'billing_name'}
                  render={({field}) => {
                    return (
                      <VFormField label={'Billing Name'}>
                        <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'Default to the business name'}/>
                      </VFormField>
                    );
                  }}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  name={'billing_address'}
                  render={({field}) => {
                    return (
                      <VFormField label={'Billing Address'}>
                        <Textarea value={field.value ?? ''} onChange={field.onChange} placeholder={'Default to the address above'}/>
                      </VFormField>
                    );
                  }}
                />
              </div>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField label={'Notes'}>
                      <Textarea value={field.value} onChange={field.onChange} className={'min-h-[150px]'}/>
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


