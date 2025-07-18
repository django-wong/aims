import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';

export function AddressForm() {
  return <>
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'Address Line 1'} for={'address_line_1'} className={'col-span-12'}>
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
      name={'address.address_line_1'}
    />
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'Address Line 2'} for={'address_line_2'} className={'col-span-12'}>
            <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
          </VFormField>
        );
      }}
      name={'address.address_line_2'}
    />
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'City'} for={'city'} className={'col-span-4'}>
            <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
          </VFormField>
        );
      }}
      name={'address.city'}
    />
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'State'} for={'state'} className={'col-span-4'}>
            <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
          </VFormField>
        );
      }}
      name={'address.state'}
    />
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'Zip / Post code'} for={'zip'} className={'col-span-4'}>
            <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
          </VFormField>
        );
      }}
      name={'address.zip'}
    />
    <FormField
      render={({field}) => {
        return (
          <VFormField label={'Country'} for={'country'} className={'col-span-12'}>
            <Input value={field.value} onChange={field.onChange} className={'bg-white'}/>
          </VFormField>
        );
      }}
      name={'address.country'}
    />
  </>
}
