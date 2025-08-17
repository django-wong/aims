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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { DialogFormProps, Budget, AssignmentType, PurchaseOrder } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import zod from 'zod';

type BudgetFormProps = DialogFormProps<Budget> & {
  purchaseOrderId?: number;
  assignmentTypes?: AssignmentType[];
  purchaseOrders?: PurchaseOrder[];
};

const updateSchema = zod.object({
  method: zod.literal('update'),
  rate_code: zod.string().min(1),
  purchase_order_id: zod.number(),
  assignment_type_id: zod.number(),
  hourly_rate: zod.number().min(0),
  budgeted_hours: zod.number().min(0),
  travel_rate: zod.number().min(0),
  budgeted_mileage: zod.number().min(0),
});

const createSchema = zod.object({
  method: zod.literal('create'),
  rate_code: zod.string().min(1),
  purchase_order_id: zod.number(),
  assignment_type_id: zod.number(),
  hourly_rate: zod.number().min(0),
  budgeted_hours: zod.number().min(0),
  travel_rate: zod.number().min(0),
  budgeted_mileage: zod.number().min(0),
});

const schema = zod.discriminatedUnion('method', [
  createSchema,
  updateSchema,
]);

export function BudgetForm(props: BudgetFormProps) {
  const form = useReactiveForm<zod.infer<typeof schema>, any>({
    ...useResource('/api/v1/budgets', {
      rate_code: '',
      purchase_order_id: props.purchaseOrderId || 0,
      assignment_type_id: 0,
      hourly_rate: 0,
      budgeted_hours: 0,
      travel_rate: 0.5,
      budgeted_mileage: 0,
      ...props.value,
      method: (props.value && props.value.id) ? 'update' : 'create' as any,
    }),
    resolver: zodResolver(schema),
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
            <DialogTitle>{isUpdate ? 'Edit Budget' : 'New Budget'}</DialogTitle>
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
                  {!props.purchaseOrderId && (
                    <div className={'col-span-12'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <VFormField required label={'Purchase Order'}>
                              <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a purchase order" />
                                </SelectTrigger>
                                <SelectContent>
                                  {props.purchaseOrders?.map((po) => (
                                    <SelectItem key={po.id} value={po.id.toString()}>
                                      {po.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </VFormField>
                          );
                        }}
                        name={'purchase_order_id'}
                      />
                    </div>
                  )}
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Assignment Type'}>
                            <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an assignment type" />
                              </SelectTrigger>
                              <SelectContent>
                                {props.assignmentTypes?.map((type) => (
                                  <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              step="0.01"
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
                              step="0.01"
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
                              step="0.01"
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
                              step="0.01"
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
          <DialogFooter>
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
