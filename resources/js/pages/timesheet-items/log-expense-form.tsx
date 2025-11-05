import { DialogWrapper } from '@/components/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { ExpensesTable } from '@/pages/expenses/table';
import { DialogFormProps, Expense } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DialogClose } from '@/components/ui/dialog';
import { Loading } from '@/components/ui/loading';
import { router } from '@inertiajs/react';
import { useTableApi } from '@/components/data-table-2';
import { useTimesheetItem } from '@/providers/timesheet-item-provider';
import { useState } from 'react';

export function LogExpenseForm(props: DialogFormProps<Expense>) {
  const item = useTimesheetItem();

  return (
    <DialogWrapper className={'sm:max-w-4xl'} innerContentClassName={'w-full'} trigger={props.children} title={'Expenses'}>
      <ExpensesTable
        params={{
          'filter[timesheet_item_id]': item?.id
        }}
        className={'w-full'}
        left={
          <ExpenseForm onSubmit={props.onSubmit}>
            <Button>Log Expense</Button>
          </ExpenseForm>
        }
      />
    </DialogWrapper>
  );
}

export function ExpenseForm(props: DialogFormProps<Expense>) {
  const timesheet_item = useTimesheetItem();
  const [open, setOpen] = useState(false);

  const form = useReactiveForm<z.infer<typeof schema>, Expense>({
    ...useResource('/api/v1/expenses', {
      ...props.value,
      type: 'travel',
      timesheet_item_id: props.value?.timesheet_item_id ?? timesheet_item?.id
    }),
    resolver: zodResolver(schema) as any,
  });

  const table = useTableApi();

  function submit() {
    form.submit().then((response) => {
      if (response?.data) {
        props.onSubmit?.(response.data);
        if (table) {
          table.reload();
        } else {
          router.reload();
        }
        setOpen(false);
      }
    })
  }
  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={props.children} title={'Log Expense'} description={'Fill in the form to log an expense, all fields will appear in the client invoice.'}
      footer={
        <>
          <DialogClose>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button disabled={form.submitDisabled} onClick={submit}>
            <Loading show={form.formState.isSubmitting}/> Submit
          </Button>
        </>
      }
      >
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-6'}>
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Creditor'} required className={'col-span-6'}>
                  <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'i.e. Perth Airport, Flight Centre, etc'} />
                </VFormField>
              );
            }}
            name={'creditor'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Net Amount'} required className={'col-span-6'}>
                  <Input type={'number'} {...field} />
                </VFormField>
              );
            }}
            name={'net_amount'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'GST'} className={'col-span-6'}>
                  <Input type={'number'} value={field.value ?? ''} onChange={field.onChange} />
                </VFormField>
              );
            }}
            name={'gst'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Fees (GST FREE)'} className={'col-span-6'}>
                  <Input type={'number'} value={field.value ?? ''} onChange={field.onChange} />
                </VFormField>
              );
            }}
            name={'process_fee'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Invoice Number'} className={'col-span-6'} description={'Make sure this matches the invoice provided by the creditor'}>
                  <Input value={field.value ?? ''} onChange={field.onChange} />
                </VFormField>
              );
            }}
            name={'invoice_number'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Report Number'} className={'col-span-6'}>
                  <Input value={field.value ?? ''} onChange={field.onChange} />
                </VFormField>
              );
            }}
            name={'report_number'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <>
                  <VFormField label={'Attachments'} description={'Upload receipts, invoices, etc'} className={'col-span-6'}>
                    <Input
                      id="picture"
                      type="file"
                      multiple
                      accept={'image/png, image/jpeg, application/pdf'}
                      onChange={(event) => {
                        field.onChange(Array.from(event.target.files ?? []));
                      }}
                    />
                  </VFormField>
                </>
              );
            }}
            name={'attachments'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Type of expense?'} required className={'col-span-6'}>
                  <RadioGroup defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                    <Label>
                      <RadioGroupItem value={'travel'} /> Travel
                    </Label>
                    <Label>
                      <RadioGroupItem value={'meals'} /> Meals
                    </Label>
                    <Label>
                      <RadioGroupItem value={'accommodation'} /> Accommodation
                    </Label>
                    <Label>
                      <RadioGroupItem value={'other'} /> Others
                    </Label>
                  </RadioGroup>
                </VFormField>
              );
            }}
            name={'type'}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <VFormField label={'Description'} className={'col-span-12'}>
                  <Textarea value={field.value ?? ''} onChange={field.onChange} />
                </VFormField>
              );
            }}
            name={'description'}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}

const attachments = z
  .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
  .max(5, 'You can only upload up to 5 files')
  .optional();

const schema = z.object({
  timesheet_item_id: z.coerce.number(),
  net_amount: z.coerce.number().min(0, { message: 'Net amount must be at least 0' }),
  gst: z.coerce.number().min(0).nullable().optional(),
  process_fee: z.coerce.number().min(0).nullable().optional(),
  type: z.string(),
  invoice_number: z.string().nullable().optional(),
  creditor: z.string(),
  description: z.string().optional().nullable(),
  report_number: z.string().optional().nullable(),
  attachments: attachments,
});
