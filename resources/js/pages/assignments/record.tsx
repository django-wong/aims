import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Button, Loading } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm } from '@/hooks/use-form';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment, SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { BookmarkCheck, House, UserCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/date-picker';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';

interface RecordProps {
  assignment: Assignment;
}

const schema = zod.object({
  assignment_id: zod.coerce.number(),
  date: zod.date().or(zod.string()).transform((value) => {
    return dayjs(value).format('YYYY/MM/DD')
  }),
  work_hours: zod.coerce.number().min(0),
  travel_hours: zod.coerce.number().min(0).optional(),
  report_hours: zod.coerce.number().min(0).optional(),
  days: zod.coerce.number().min(0).optional(),
  overnights: zod.coerce.number().min(0).optional(),
  km_traveled: zod.coerce.number().min(0).optional(),
});

type Record = zod.infer<typeof schema>;

export default function Record(props: RecordProps) {
  const page = usePage<SharedData>();

  const defaultValues: Record = {
    assignment_id: props.assignment.id,
    date: (new Date()).toISOString(),
    work_hours: 0
  };

  const form = useReactiveForm<Record>({
    url: '/api/v1/timesheet-items',
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  const submit = form.handleSubmit(async (data) => {
    router.post(
      route('timesheets.capture'), data
    )
  });

  async function save() {
    await submit();
  }

  return (
    <BaseLayout>
      <Head title={props.assignment.project?.title} />
      <div className={'px-4 py-4 lg:py-8'}>
        <div className={'mx-auto max-w-2xl p-2'}>
          <Info>
            <div>
              <div className={'mb-4 flex items-center justify-between'}>
                <div className={'flex items-center gap-2 -ml-3 text-3xl font-bold'}>
                  <BookmarkCheck className={'h-16 w-16'} />
                </div>
                <div className={'flex gap-4'}>
                  <Button variant={'outline'}>
                    <span className={'hidden md:inline'}>
                      {page.props.auth.user?.name}
                    </span>
                    <UserCircle/>
                  </Button>
                </div>
              </div>
            </div>
            <div className={'flex flex-col gap-4'}>
              <h1 className={'text-xl font-bold'}>{props.assignment.project?.title}</h1>
              <div className={'flex justify-start'}>
                <div className={'flex items-center justify-start gap-2 rounded-lg border px-2 py-1 text-sm'}>
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
              <Badge>
                {props.assignment.assignment_type?.name}
              </Badge>
            </InfoLine>
            <Divider />
            <InfoHead>Timesheet</InfoHead>
            <div className={'grid grid-cols-12 gap-4'}>
              <Form {...form}>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField required label={'Date'} for={'date'} error={fieldState.error?.message}>
                          <DatePicker value={field.value} onChange={(date) => field.onChange(date)}/>
                        </VFormField>
                      </>
                    }}
                    name={'date'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return (
                        <>
                          <VFormField label={'Days'} for={'hours'} error={fieldState.error?.message}>
                            <Input
                              min={0} type={'number'}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'days'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField label={'Overnights'} for={'overnights'} error={fieldState.error?.message}>
                          <Input min={0} type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'overnights'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField required label={'Work Hours'} for={'work_hours'} error={fieldState.error?.message}>
                          <Input min={0} type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'work_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField label={'Travel Hours'} for={'travel_hours'} error={fieldState.error?.message}>
                          <Input min={0} type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'travel_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField label={'Report Hours'} for={'report_hours'} error={fieldState.error?.message}>
                          <Input min={0} type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'report_hours'}
                  />
                </div>

                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({field, fieldState}) => {
                      return <>
                        <VFormField label={'KM Traveled'} for={'km_traveled'} error={fieldState.error?.message}>
                          <Input min={0} type={'number'} value={field.value} onChange={field.onChange}/>
                        </VFormField>
                      </>
                    }}
                    name={'km_traveled'}
                  />
                </div>

                <div className={'col-span-12'}>
                  <Button disabled={form.submitDisabled || form.formState.isSubmitting} className={'w-full'} onClick={save}>
                    <Loading show={form.formState.isSubmitting}/>
                    Add
                  </Button>
                </div>
              </Form>
            </div>
          </Info>
        </div>
      </div>
    </BaseLayout>
  );
}
