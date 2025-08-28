import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { DialogFormProps, Budget } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import zod from 'zod';
import { AssignmentTypeSelect } from '@/components/assignment-type-select';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';

const schema = zod.object({
  purchase_order_id: zod.coerce.number().optional(),
  assignment_type_id: zod.coerce.number().min(1, 'Assignment Type is required'),
  rate_code: zod.string().min(1),
  hourly_rate: zod.coerce.number().min(1),
  budgeted_hours: zod.coerce.number().min(1),
  travel_rate: zod.coerce.number().min(1),
  budgeted_mileage: zod.coerce.number().min(1),
});

export function BudgetForm(props: DialogFormProps<Budget>) {
  const po = usePurchaseOrder();
  const form = useReactiveForm<zod.infer<typeof schema>, any>({
    ...useResource('/api/v1/budgets', {
      rate_code: '',
      purchase_order_id: po?.id,
      assignment_type_id: 0,
      hourly_rate: 0,
      budgeted_hours: 0,
      travel_rate: 0.5,
      budgeted_mileage: 0,
      ...props.value,
      method: (props.value && props.value.id) ? 'update' : 'create' as any,
    }),
    resolver: zodResolver(schema) as any,
  });

  const isUpdate = !!(props.value && props.value.id);

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        console.info('Budget saved successfully', response);
        props.onSubmit(response.data);
      }
    });
  }

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        {props.children && <DialogTrigger asChild={props.asChild === undefined ? true : props.asChild}>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isUpdate ? 'Edit Budget' : 'New Budget'}
            </DialogTitle>
            <DialogDescription>Fill in the details below to create or update the budget.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <form>
              <div className={'grid grid-cols-12 gap-6'}>
                <Form {...form}>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Rate Code'}>
                            <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'e.g., INSP-STD'} />
                          </VFormField>
                        );
                      }}
                      name={'rate_code'}
                    />
                  </div>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Assignment Type'}>
                            <AssignmentTypeSelect disabled={!!props.value} onValueChane={(value) => field.onChange(value)} value={field.value}/>
                          </VFormField>
                        );
                      }}
                      name={'assignment_type_id'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Hourly Rate'}>
                            <Input
                              type="number"
                              step="10"
                              min="0"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder={'0.00'}
                            />
                          </VFormField>
                        );
                      }}
                      name={'hourly_rate'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Budgeted Hours'}>
                            <Input
                              type="number"
                              step="10"
                              min="0"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder={'0.00'}
                            />
                          </VFormField>
                        );
                      }}
                      name={'budgeted_hours'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Travel Rate'}>
                            <Input
                              type="number"
                              step="10"
                              min="0"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder={'0.50'}
                            />
                          </VFormField>
                        );
                      }}
                      name={'travel_rate'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Budgeted Mileage'}>
                            <Input
                              type="number"
                              step="10"
                              min="0"
                              value={field.value?.toString() ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder={'0.00'}
                            />
                          </VFormField>
                        );
                      }}
                      name={'budgeted_mileage'}
                    />
                  </div>
                </Form>
              </div>
            </form>
          </DialogInnerContent>
          <DialogFooter className={'flex items-center'}>
            <span className={'flex-grow text-sm text-gray-500 flex items-center gap-1'}>
              Purchasr Order #{po?.id}
            </span>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={form.submitDisabled} onClick={save}>
              {form.formState.isSubmitting ? <Circle className={'animate-spin'} /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
