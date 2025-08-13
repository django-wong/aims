import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Address, BaseModel } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import zod from 'zod';

export const schema = zod.object({
  address_line_1: zod.string().min(1, 'Address line 1 is required'),
  address_line_2: zod.string().optional().nullable(),
  city: zod.string().min(1, 'City is required'),
  state: zod.string().min(1, 'State is required'),
  zip: zod.string().min(1, 'Zip code is required'),
  country: zod.string().min(1, 'Country is required'),
  full_address: zod.string().optional().nullable(),
});

type ThisAddress = zod.infer<typeof schema>;

export type FormProviderProps<T> = {
  value: T | null;
  children?: React.ReactNode;
};

export const AddressFormContext = React.createContext<ReturnType<typeof useReactiveForm<Address>> | null>(null);

export function AddressFormProvider(props: FormProviderProps<ThisAddress>) {
  const form = useReactiveForm<Address>({
    resolver: zodResolver(schema) as any,
    defaultValues: props.value || undefined,
  });

  return <AddressFormContext.Provider value={form}>{props.children}</AddressFormContext.Provider>;
}

export function useAddressForm() {
  const form = React.useContext(AddressFormContext);
  if (!form) {
    throw new Error('useAddressForm must be used within an AddressFormProvider');
  }
  return form;
}

export function AddressForm() {
  const form = useAddressForm();
  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          render={({ field }) => {
            return (
              <VFormField label={'Address Line 1'} className={'col-span-12'}>
                <Input
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    field.onBlur();
                  }}
                />
              </VFormField>
            );
          }}
          name={'address_line_1'}
        />
        <FormField
          control={form.control}
          render={({ field }) => {
            return (
              <VFormField label={'Address Line 2'} className={'col-span-12'}>
                <Input value={field.value ?? ''} onChange={field.onChange} />
              </VFormField>
            );
          }}
          name={'address_line_2'}
        />
        <FormField
          control={form.control}
          render={({ field }) => {
            return (
              <VFormField label={'City'} className={'col-span-4'}>
                <Input value={field.value} onChange={field.onChange} />
              </VFormField>
            );
          }}
          name={'city'}
        />
        <FormField
          render={({ field }) => {
            return (
              <VFormField label={'State'} className={'col-span-4'}>
                <Input value={field.value} onChange={field.onChange} />
              </VFormField>
            );
          }}
          control={form.control}
          name={'state'}
        />
        <FormField
          render={({ field }) => {
            return (
              <VFormField label={'Zip / Post code'} className={'col-span-4'}>
                <Input value={field.value} onChange={field.onChange} />
              </VFormField>
            );
          }}
          control={form.control}
          name={'zip'}
        />
        <FormField
          control={form.control}
          render={() => {
            return (
              <VFormField label={'Country'} className={'col-span-12'}>
                <Input {...form.register('country')} />
              </VFormField>
            );
          }}
          name={'country'}
        />
      </Form>
    </>
  );
}
