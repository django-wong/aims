import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { useReactiveForm } from '@/hooks/use-form';
import { Client } from '@/types';
import { FormField, Form } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { AddressForm } from '@/pages/projects/address-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ClientFormProps = PropsWithChildren;

export function ClientForm(props: ClientFormProps) {
  const form = useReactiveForm<Client>();

  return (
    <Dialog>
      <DialogTrigger>{props.children}</DialogTrigger>
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
                  render={({ field, fieldState }) => {
                    return <VFormField label={'Coordinator'} for={'coordinator_id'} error={fieldState.error?.message}>
                      <CoordinatorSelect
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
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
              <AddressForm/>
            </Form>
          </div>
        </DialogInnerContent>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'} type={'button'}>
              Cancel
            </Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type CoordinatorSelectProps = PropsWithChildren<React.ComponentProps<typeof Select>>;

export function CoordinatorSelect(props: CoordinatorSelectProps) {
  return (
    <Select value={props.value}>
      <SelectTrigger className={'w-full bg-white'}>
        <SelectValue placeholder={'Select coordinator'}/>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'1'}>Coordinator 1</SelectItem>
      </SelectContent>
    </Select>
  );
}
