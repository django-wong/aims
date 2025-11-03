import { DatePicker, MultipleDatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';
import { useProject } from '@/providers/project-provider';

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

  dates: z.array(
    z
    .date()
    .or(z.string())
    .transform((value) => {
      return dayjs(value).format('YYYY/MM/DD');
    })
  ).optional(),

  date: z.string().optional().nullable(),

  work_hours: number,
  travel_hours: number,
  report_hours: number,

  // days: number,
  overnights: number,

  travel_distance: number,

  attachments: attachments,
});

type Record = z.infer<typeof timesheetItemSchema>;

export function TimesheetItemForm(props: PropsWithChildren<TimesheetItemFormProps>) {
  const project = useProject();
  const form = useReactiveForm<Record, TimesheetItem>({
    ...useResource('/api/v1/timesheet-items', {
      timesheet_id: props.timesheet?.id,
      ...props.value,
    }),
    resolver: zodResolver(timesheetItemSchema) as any,
    serialize: (data) => {
      return objectToFormData(data);
    },
  });

  useEffect(() => {
    console.log(props.timesheet);
  });

  const [open, setOpen] = useState(false);

  async function save() {
    form.submit().then((response) => {
      startTransition(() => {
        if (response) {
          props.onSubmit?.(response.data);
        }
        form.reset();
        setOpen(false);
        router.reload();
      });
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log work hour</DialogTitle>
            <DialogDescription>Please be sure to fill in correctly the work hour for this timesheet.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <div className={'grid grid-cols-12 gap-4'}>
              <Form {...form}>
                {
                  props.value ? (
                    <div className={'col-span-12 md:col-span-6'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <>
                              <VFormField required label={'Date'}>
                                <DatePicker
                                  calendar={{
                                    month: props.timesheet?.start ? new Date(props.timesheet?.start) : undefined
                                  }}
                                  disabled
                                  value={field.value ?? undefined}
                                  onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY/MM/DD') : null)}
                                />
                              </VFormField>
                            </>
                          );
                        }}
                        name={'date'}
                      />
                    </div>
                  ) : (
                    <div className={'col-span-12 md:col-span-6'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <>
                              <VFormField required label={'Date'}>
                                <MultipleDatePicker
                                  calendar={{
                                    month: props.timesheet?.start ? new Date(props.timesheet?.start) : undefined,
                                    disabled: (date) => {
                                      if (props.timesheet) {
                                        const start = dayjs(props.timesheet.start);
                                        const end = dayjs(props.timesheet.end);
                                        return start.isAfter(date, 'day') || end.isBefore(date, 'day');
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
                        name={'dates'}
                      />
                    </div>
                  )
                }
                <div className={'col-span-12 md:col-span-6'}>
                  <div>
                    <div className={'grid grid-cols-12 gap-4'}>
                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <>
                                <VFormField label={'Overnights'}>
                                  <Input min={0} type={'number'} value={field.value} onChange={field.onChange} />
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
                <div className={'col-span-12 md:col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <>
                          <VFormField label={'Travel Distance'}>
                            <Input placeholder={project?.unit} step={10} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        </>
                      );
                    }}
                    name={'travel_distance'}
                  />
                </div>
                <div className={'col-span-12 md:col-span-12'}>
                  <div>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <>
                            <VFormField label={'Attachments'} description={'Any file you want to share with administrator. Up to 5 files, 50MB each'}>
                              <Input
                                id="picture"
                                type="file"
                                multiple
                                accept={'*'}
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
                  </div>
                </div>
              </Form>
            </div>
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button disabled={form.submitDisabled || form.formState.isSubmitting} onClick={save}>
              <Loading show={form.formState.isSubmitting} />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
