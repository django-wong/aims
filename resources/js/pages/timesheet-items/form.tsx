import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { VFormField } from '@/components/vform';
import { objectToFormData, useReactiveForm, useResource } from '@/hooks/use-form';
import { DialogFormProps, Timesheet, TimesheetItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { PropsWithChildren, startTransition, useEffect, useState } from 'react';
import z from 'zod';

type TimesheetItemFormProps = {
  timesheet?: Timesheet;
} & DialogFormProps<TimesheetItem>;

const attachments = z
  .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
  .max(5, 'You can only upload up to 5 files')
  .optional();

const number = z.coerce.number().min(0).optional();

const timesheetItemSchema = z.object({
  timesheet_id: z.number(),
  date: z
    .date()
    .or(z.string())
    .transform((value) => {
      return dayjs(value).format('YYYY/MM/DD');
    }),
  work_hours: number,
  travel_hours: number,
  report_hours: number,
  days: number,
  overnights: number,
  travel_distance: number,
  travel_rate: number,

  hotel: number,
  rail_or_airfare: number,
  meals: number,
  other: number,

  attachments: attachments,
});

type Record = z.infer<typeof timesheetItemSchema>;

export function TimesheetItemForm(props: PropsWithChildren<TimesheetItemFormProps>) {
  const form = useReactiveForm<Record, TimesheetItem>({
    ...useResource('/api/v1/timesheet-items', {
      timesheet_id: props.timesheet?.id,
      date: dayjs(props.timesheet?.start || Date.now()).toISOString(),
      ...props.value,
    }),
    resolver: zodResolver(timesheetItemSchema) as any,
    serialize: (data) => {
      return objectToFormData(data);
    },
  });

  useEffect(() => {
    console.log(props.timesheet);
  })

  const [open, setOpen] = useState(false);

  async function save() {
    form.submit().then((response) => {
      startTransition(() => {
        if (response) {
          props.onSubmit?.(response.data);
          form.reset();
          setOpen(false);
          router.reload();
        }
      });
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timesheet</DialogTitle>
            <DialogDescription>Please be sure to fill in correctly the timesheet for this assignment.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <div className={'grid grid-cols-12 gap-4'}>
              <Form {...form}>
                <div className={'col-span-12 md:col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField required label={'Date'}>
                            <DatePicker
                              calendar={{
                                disabled: (date) => {
                                  if (props.timesheet) {
                                    const start = dayjs(props.timesheet.start);
                                    const end = dayjs(props.timesheet.end);
                                    return start.isAfter(date) || end.isBefore(date);
                                  }
                                  return false;
                                },
                              }}
                              value={field.value}
                              onChange={(date) => field.onChange(date)}
                            />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'date'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-6'}>
                  <div>
                    <div className={'grid grid-cols-12 gap-4'}>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <>
                                <VFormField label={'Days'}>
                                  <Input placeholder={'Day'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                </VFormField>
                              </>
                            );
                          }}
                          name={'days'}
                        />
                      </div>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <>
                                <VFormField label={'Overnights'}>
                                  <Input placeholder={'Overnight'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                </VFormField>
                              </>
                            );
                          }}
                          name={'overnights'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Work Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'work_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Travel Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Remote Hours'}>
                            <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'report_hours'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-8'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Mileage'}>
                            <Input placeholder={'KM/Mileage'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_distance'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-4'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Travel Rate'}>
                            <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_rate'}
                  />
                </div>
                <div className={'col-span-12'}>
                  <Accordion type={'single'} className={'w-full'} defaultValue={''} collapsible>
                    <AccordionItem value={'expenses'}>
                      <AccordionTrigger>
                        Expenses (click to expand)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className={'w-full'}>
                          <div className={'grid grid-cols-12 gap-4'}>
                            <div className={'col-span-12 md:col-span-3'}>
                              <FormField
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <VFormField label={'Hotel'}>
                                      <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                    </VFormField>
                                  );
                                }}
                                name={'hotel'}
                              />
                            </div>
                            <div className={'col-span-12 md:col-span-3'}>
                              <FormField
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <VFormField label={'Rail/Airfare'}>
                                      <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                    </VFormField>
                                  );
                                }}
                                name={'rail_or_airfare'}
                              />
                            </div>
                            <div className={'col-span-12 md:col-span-3'}>
                              <FormField
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <VFormField label={'Meals'}>
                                      <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                    </VFormField>
                                  );
                                }}
                                name={'meals'}
                              />
                            </div>
                            <div className={'col-span-12 md:col-span-3'}>
                              <FormField
                                control={form.control}
                                render={({ field }) => {
                                  return (
                                    <VFormField label={'Other'}>
                                      <Input placeholder={'$'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                    </VFormField>
                                  );
                                }}
                                name={'other'}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className={'col-span-12 md:col-span-12'}>
                  <div>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem>
                              <FormLabel>Attachments (Expense receipt, flash report etc)</FormLabel>
                              <Input
                                id="picture" type="file" multiple accept={'*'}
                                  onChange={(event) => {
                                  field.onChange(Array.from(event.target.files ?? []));
                                }}
                              />
                            </FormItem>
                          </>
                        );
                      }}
                      name={'attachments'}
                    />
                  </div>
                </div>
              </Form>
            </div>
          </DialogInnerContent>
          <DialogFooter>
            <Button disabled={form.submitDisabled || form.formState.isSubmitting} onClick={save}>
              <Loading show={form.formState.isSubmitting} />
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
