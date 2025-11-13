import { DialogWrapper } from '@/components/dialog-wrapper';
import { DialogFormProps, Org } from '@/types';
import { useState } from 'react';
import { useReactiveForm } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimezoneSelect } from '@/components/timezone-select';
import { AddressDialog, addressSchema } from '@/pages/projects/address-form';
import { Button } from '@/components/ui/button';
import { LocationEdit } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import { useTableApi } from '@/components/data-table-2';
import { router } from '@inertiajs/react';

const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }).max(50, { message: 'Name must be less than 50 characters' }),
  code: z.string().min(2, { message: 'Code is required' }).max(10, { message: 'Code must be less than 10 characters' }),
  timezone: z.string().min(2, 'Timezone is required'),
  address: addressSchema.optional(),
})

export function OrgForm(props: DialogFormProps<Org>) {
  const form = useReactiveForm<z.infer<typeof schema>, Org>({
    url: '/api/v1/orgs' + (props.value?.id ? `/${props.value.id}` : ''),
    method: 'PUT',
    defaultValues: {
      ...props.value,
    },
    resolver: zodResolver(schema)
  });

  const [open, setOpen] = useState(false);

  const table = useTableApi();

  function submit() {
    form.submit().then((res) => {
      if (res) {
        setOpen(false);
        if (table) {
          table.reload();
        } else {
          router.reload();
        }
      }
    })
  }
  return (
    <DialogWrapper
      footer={
        <>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button onClick={submit}>Submit</Button>
        </>
      }
      open={open} onOpenChange={setOpen} trigger={props.children} title={'Organization'} description={'Manage organization information'}>
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-6'}>
          <FormField
            control={form.control}
            name={'name'}
            render={({ field }) => (
              <VFormField label={'Name'} required className={'col-span-8'}>
                <Input placeholder={'Full business name'} {...field} />
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'code'}
            render={({ field }) => (
              <VFormField label={'Code'} required className={'col-span-4'}>
                <Input placeholder={'Full business name'} {...field} />
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'timezone'}
            render={({ field }) => (
              <VFormField label={'Timezone'} required className={'col-span-12'}>
                <TimezoneSelect
                  value={field.value}
                  onValueChane={field.onChange}
                />
              </VFormField>
            )}
          />
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
        </div>
      </Form>
    </DialogWrapper>
  );
}
