import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm } from '@/hooks/use-form';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment } from '@/types';
import { Head } from '@inertiajs/react';
import { BookmarkCheck, EllipsisVertical, House } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RecordProps {
  assignment: Assignment;
}

const schema = zod.object({
  date: zod.string().min(1, 'Date is required'),
  work_hours: zod.number().min(0, 'Hours must be a positive number'),
  travel_hours: zod.number().min(0, 'Travel hours must be a positive number').optional(),
  report_hours: zod.number().min(0, 'Report hours must be a positive number').optional(),
  days: zod.number().min(0, 'Days must be a positive number').optional(),
  overnights: zod.number().min(0, 'Overnights must be a positive number').optional(),
  km_traveled: zod.number().min(0, 'KM traveled must be a positive number').optional(),
});

export default function Record(props: RecordProps) {
  const form = useReactiveForm<zod.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  return (
    <BaseLayout>
      <Head title={props.assignment.project?.title} />
      <div className={'px-4 py-16'}>
        <div className={'bg-background ring-muted-foreground/10 mx-auto max-w-2xl rounded-xl p-8 shadow-md ring-8'}>
          <Info>
            <div>
              <div className={'mb-4 flex items-center justify-between'}>
                <div className={'bg-muted/50 rounded-lg border p-2'}>
                  <BookmarkCheck className={'h-8 w-8'} />
                </div>
                <div className={'flex gap-4'}>
                  <Button variant={'outline'}>
                    <EllipsisVertical />
                  </Button>
                </div>
              </div>
            </div>
            <div className={'flex flex-col gap-4'}>
              <h1 className={'text-xl font-bold'}>{props.assignment.project?.title}</h1>
              <div className={'flex justify-start'}>
                <div className={'flex items-center justify-start gap-2 rounded-lg border p-1 text-sm'}>
                  <House className={'w-4'} />
                  {(props.assignment.operation_org || props.assignment.org)?.name ?? 'Org Name'}
                </div>
              </div>
            </div>
            <Divider />
            <InfoHead>Details</InfoHead>
            <InfoLine label={'Client Name'}>{props.assignment.project?.client?.business_name}</InfoLine>
            <InfoLine label={'Project'}>{props.assignment.project?.title}</InfoLine>
            <InfoLine label={'Assignment Type'}>
              <span className={'rounded-full border px-2 py-1'}>{props.assignment.assignment_type?.name}</span>
            </InfoLine>
            <Divider />
            <InfoHead>Timesheet</InfoHead>
            <div className={'grid grid-cols-12 gap-4'}>
              <Form {...form}>
                <div className={'col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <VFormField label={'Work Hours'} for={'hours'}>
                          <Input type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'work_hours'}
                  />
                </div>
                <div className={'col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <VFormField label={'Travel Hours'} for={'hours'}>
                          <Input type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'travel_hours'}
                  />
                </div>
                <div className={'col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <VFormField label={'Report Hours'} for={'hours'}>
                          <Input type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'report_hours'}
                  />
                </div>
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <VFormField label={'Days'} for={'hours'}>
                          <Input type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'days'}
                  />
                </div>
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <VFormField label={'KM Traveled'} for={'hours'}>
                          <Input type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'km_traveled'}
                  />
                </div>
                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <Label>
                          <Switch checked={!!field.value} onCheckedChange={field.onChange}/>
                          Overnights
                        </Label>
                      </>
                    }}
                    name={'overnights'}
                  />
                </div>
                <div className={'col-span-12'}>
                  <Button className={'w-full'} type={'submit'}>Add</Button>
                </div>
              </Form>
            </div>
          </Info>
        </div>
      </div>
    </BaseLayout>
  );
}
