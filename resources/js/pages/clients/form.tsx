import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { useReactiveForm } from '@/hooks/use-form';
import { Client, DialogFormProps } from '@/types';
import { FormField, Form } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { AddressForm } from '@/pages/projects/address-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRerender } from '@/hooks/use-rerender';
import { Textarea } from '@/components/ui/textarea';

export function ClientForm(props: DialogFormProps) {
  const form = useReactiveForm<Client>({
    url: route('clients.store'),
    method: 'POST',
    defaultValues: {
      business_name: 'My Awesome Name',
      coordinator_id: null,
      reviewer_id: null,
      address: {
        address_line_1: '123 Main St',
        address_line_2: 'Suite 100',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      },
      user: {
        name: '',
        email: '',
      }
    }
  });

  const render = useRerender();

  function save() {
    form.submit().then(res => {
      if (res) {
        props.onSuccess();
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Client</DialogTitle>
          <DialogDescription>Fill in the details below to create or update the client.</DialogDescription>
        </DialogHeader>
        <DialogInnerContent className={'max-h-[48vh] overflow-y-auto'}>
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
              <Dialog>
                <DialogTrigger asChild>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({field}) => {
                        console.info(field);
                        return (
                          <VFormField
                            label={'Address'}
                            for={'address'}
                          >
                            <div className={'flex items-end gap-2 outline-dashed outline-2 p-4 rounded-md outline-border bg-white'}>
                              <div className={'text-sm flex-1'}>
                                <p>{field.value?.address_line_1}</p>
                                <p>
                                  {field.value?.city}, {field.value?.state}, {field.value?.zip}, {field.value?.country}
                                </p>
                              </div>
                              <Button variant={'secondary'} size={'sm'}>
                                Edit
                              </Button>
                            </div>
                          </VFormField>
                        );
                      }}
                      name={'address'}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Address</DialogTitle>
                    <DialogDescription>You can fill in the address manually, or use the location finder.</DialogDescription>
                  </DialogHeader>
                  <DialogInnerContent>
                    <div className={'grid grid-cols-12 gap-4'}>
                      <AddressForm/>
                    </div>
                  </DialogInnerContent>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type={'button'} onClick={render}>
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/*<div className={'col-span-12 flex gap-4'}>*/}
              {/*  <VFormField label={'Coordinator'} for={'coordinator'}>*/}
              {/*    <div className={'h-16 w-16 rounded-full bg-white border border-border border-dashed'}>*/}

              {/*    </div>*/}
              {/*  </VFormField>*/}
              {/*  <VFormField label={'Reviewer'} for={'reviewer'}>*/}
              {/*    <div className={'h-16 w-16 rounded-full bg-white border border-border border-dashed'}>*/}

              {/*    </div>*/}
              {/*  </VFormField>*/}
              {/*</div>*/}
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
          <Button onClick={save}>Save</Button>
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
