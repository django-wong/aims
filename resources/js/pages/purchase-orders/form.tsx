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
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { PurchaseOrder, DialogFormProps } from '@/types';
import { FormField, Form } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { ClientSelect } from '@/components/client-select';

const schema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  client_id: zod.number().min(1, 'Client is required'),
  budget: zod.number().min(1, 'Budget must be positive'),
  hourly_rate: zod.number().min(1, 'Hourly rate must be positive'),
  first_alert_threshold: zod.number().min(1).max(100).default(70),
  second_alert_threshold: zod.number().min(1).max(100).default(90),
  final_alert_threshold: zod.number().min(1).max(100).default(100),
});

export function PurchaseOrderForm(props: DialogFormProps<PurchaseOrder>) {
  const form = useReactiveForm<PurchaseOrder>({
    ...useResource<PurchaseOrder>('/api/v1/purchase-orders', {
      title: '',
      budget: 0,
      hourly_rate: 0,
      first_alert_threshold: 70,
      second_alert_threshold: 90,
      final_alert_threshold: 100,
      ...props.value
    }),
    resolver: zodResolver(schema) as any
  });

  function save() {
    form.submit().then(res => {
      if (res) {
        props.onOpenChange?.(false);
        props.onSubmit(form.getValues());
      }
    })
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.value ? 'Edit Purchase Order' : 'New Purchase Order'}</DialogTitle>
          <DialogDescription>Fill in the details below to create or update the purchase order.</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <div className={'grid grid-cols-12 gap-6'}>
            <Form {...form}>
              <div className={'col-span-12'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField required label={'Purchase Order Title'}>
                      <Input value={field.value || ''} onChange={field.onChange}/>
                    </VFormField>
                  }}
                  name={'title'}
                />
              </div>

              <div className={'col-span-12'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return <VFormField required label={'Client'}>
                      <ClientSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>
                  }}
                  name={'client_id'}
                />
              </div>

              <div className={'col-span-6'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField required label={'Budget ($)'}>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </VFormField>
                  }}
                  name={'budget'}
                />
              </div>

              <div className={'col-span-6'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField required label={'Hourly Rate ($)'}>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </VFormField>
                  }}
                  name={'hourly_rate'}
                />
              </div>

              <div className={'col-span-4'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField label={'First Alert (%)'}>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={field.value || 70}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 70)}
                      />
                    </VFormField>
                  }}
                  name={'first_alert_threshold'}
                />
              </div>

              <div className={'col-span-4'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField label={'Second Alert (%)'}>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={field.value || 90}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 90)}
                      />
                    </VFormField>
                  }}
                  name={'second_alert_threshold'}
                />
              </div>

              <div className={'col-span-4'}>
                <FormField
                  render={({ field }) => {
                    return <VFormField label={'Final Alert (%)'}>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={field.value || 100}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                      />
                    </VFormField>
                  }}
                  name={'final_alert_threshold'}
                />
              </div>
            </Form>
          </div>
        </DialogInnerContent>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={save} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : (props.value ? 'Update' : 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
