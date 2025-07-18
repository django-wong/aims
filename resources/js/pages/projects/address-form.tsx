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

export type FormProviderProps<T extends BaseModel> = {
  value: T | null;
  children?: React.ReactNode;
};

export const AddressFormContext = React.createContext<ReturnType<typeof useReactiveForm<Address>> | null>(null);

export function AddressFormProvider(props: FormProviderProps<Address>) {
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
          render={({ field, fieldState }) => {
            return (
              <VFormField label={'Address Line 1'} for={'address_line_1'} className={'col-span-12'} error={fieldState.error?.message}>
                <Input
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    field.onBlur();
                  }}
                  className={'bg-white'}
                />
              </VFormField>
            );
          }}
          name={'address_line_1'}
        />
        <FormField
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <VFormField label={'Address Line 2'} for={'address_line_2'} className={'col-span-12'} error={fieldState.error?.message}>
                <Input value={field.value ?? ''} onChange={field.onChange} className={'bg-white'} />
              </VFormField>
            );
          }}
          name={'address_line_2'}
        />
        <FormField
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <VFormField label={'City'} for={'city'} className={'col-span-4'} error={fieldState.error?.message}>
                <Input value={field.value} onChange={field.onChange} className={'bg-white'} />
              </VFormField>
            );
          }}
          name={'city'}
        />
        <FormField
          render={({ field, fieldState }) => {
            return (
              <VFormField label={'State'} for={'state'} className={'col-span-4'} error={fieldState.error?.message}>
                <Input value={field.value} onChange={field.onChange} className={'bg-white'} />
              </VFormField>
            );
          }}
          control={form.control}
          name={'state'}
        />
        <FormField
          render={({ field, fieldState }) => {
            return (
              <VFormField label={'Zip / Post code'} for={'zip'} className={'col-span-4'} error={fieldState.error?.message}>
                <Input value={field.value} onChange={field.onChange} className={'bg-white'} />
              </VFormField>
            );
          }}
          control={form.control}
          name={'zip'}
        />
        <FormField
          control={form.control}
          render={({ fieldState }) => {
            return (
              <VFormField label={'Country'} for={'country'} className={'col-span-12'} error={fieldState.error?.message}>
                <Input {...form.register('country')} className={'bg-white'} />
              </VFormField>
            );
          }}
          name={'country'}
        />
      </Form>
    </>
  );
}
