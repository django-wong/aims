import { Assignment, DialogFormProps, TimesheetItem } from '@/types';
import dayjs from 'dayjs';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { objectToFormData, useReactiveForm, useResource } from '@/hooks/use-form';
import { PropsWithChildren, startTransition, useState } from 'react';
import { router } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { DatePicker } from '@/components/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon, UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

type TimesheetItemFormProps ={
  assignment?: Assignment['id'];
} & DialogFormProps<TimesheetItem>

const attachments = z
  .array(z.instanceof(File).refine((file) => file.size < 524288000, 'File size must be less than 500MB'))
  .max(5, 'You can only upload up to 5 files')
  .optional();

const number = z.coerce.number().min(0).optional();

const timesheetItemSchema = z.object({
  assignment_id: z.coerce.number(),
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
    ...(
      useResource('/api/v1/timesheet-items', {
        assignment_id: props.assignment,
        date: new Date().toISOString(),
        ...props.value
      })
    ),
    resolver: zodResolver(timesheetItemSchema) as any,
    serialize: (data) => {
      return objectToFormData(data);
    },
  });

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
                                  return date > new Date();
                                }
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
                <div className={'col-span-12 grid grid-cols-1 gap-3 p-2 bg-muted rounded-md ring-2 ring-border'}>
                  <Label className={'my-2'}>Expenses</Label>
                  <div className={'bg-background rounded-md p-4 border'}>
                    <FormItem>
                      {/*<div className={'h-[1px] relative my-4 bg-foreground/30'}>*/}
                      {/*  <div className={'absolute -top-[0.7rem] flex items-center justify-center w-full'}>*/}
                      {/*    <span className={'bg-background px-2'}>*/}
                      {/*      Additional Expenses*/}
                      {/*    </span>*/}
                      {/*  </div>*/}
                      {/*</div>*/}
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
                    </FormItem>
                  </div>
                </div>
                <div className={'col-span-12 md:col-span-12'}>
                  <div
                  // label={'Attachments'}
                  // for={'attachments'}
                  // error={form.formState.errors.attachments?.message}
                  >
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem>
                              <FormLabel>Attachments</FormLabel>
                              <div
                                className={'bg-background dark:bg-input/30 flex flex-col items-center justify-center gap-2 rounded-lg border p-16'}
                              >
                                <UploadIcon />
                                <FormControl>
                                  <Button asChild variant={'outline'} className={'cursor-pointer'}>
                                    <label>
                                      <input
                                        multiple
                                        type={'file'}
                                        accept={'*'}
                                        className={'hidden'}
                                        onChange={(event) => {
                                          console.info(event);
                                          field.onChange(Array.from(event.target.files ?? []));
                                        }}
                                      />
                                      <span className={'flex items-center gap-2'}>
                                        <PlusIcon />
                                        Add Attachments
                                      </span>
                                    </label>
                                  </Button>
                                </FormControl>
                              </div>
                            </FormItem>
                          </>
                        );
                      }}
                      name={'attachments'}
                    />
                    <div className={'mt-2'}>
                      {form.watch('attachments')?.length ? (
                        <div className={'flex flex-col gap-2'}>
                          {(form.watch('attachments') || []).map((file, index) => (
                            <p key={index} className={'text-muted-foreground flex-grow text-sm'}>
                              {file.name}
                            </p>
                          ))}
                        </div>
                      ) : null}
                    </div>
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


