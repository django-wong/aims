import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Badge } from '@/components/ui/badge';
import { Button, Loading } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input, Inputs } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { BaseLayout } from '@/layouts/base-layout';
import { Assignment, SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { BookmarkCheck, ChevronLeft, ChevronRight, House, Plus, UserCircle } from 'lucide-react';
import zod from 'zod';
import { SvgBg } from '@/components/svg-bg';

interface RecordProps {
  assignment: Assignment;
}

const schema = zod.object({
  assignment_id: zod.coerce.number(),
  date: zod
    .date()
    .or(zod.string())
    .transform((value) => {
      return dayjs(value).format('YYYY/MM/DD');
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
    date: new Date().toISOString(),
    work_hours: 0,
  };

  const form = useReactiveForm<Record>({
    url: '/api/v1/timesheet-items',
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  const submit = form.handleSubmit(async (data) => {
    router.post(route('timesheets.capture'), data);
  });

  async function save() {
    await submit();
  }

  return (
    <BaseLayout>
      <Head title={props.assignment.project?.title} />
      <div className={'px-4 py-4 lg:py-8'}>
        <div className={'mx-auto max-w-2xl p-2 h-[100vh] mb-4'}>
          <Info>
            <div>
              <div className={'mb-4 flex items-center justify-between'}>
                <div className={'-ml-3 flex items-center gap-2 text-3xl font-bold'}>
                  <BookmarkCheck className={'h-16 w-16'} />
                </div>
                <div className={'sm:flex gap-4 hidden'}>
                  <Button variant={'outline'}>
                    <span className={'hidden md:inline'}>{page.props.auth.user?.name}</span>
                    <UserCircle />
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
            <Divider className={'my-4'} />
            <InfoHead>Details</InfoHead>
            <InfoLine label={'Client Name'}>{props.assignment.project?.client?.business_name}</InfoLine>
            <InfoLine label={'Project'}>{props.assignment.project?.title}</InfoLine>
            <InfoLine label={'Assignment Type'}>
              <Badge>{props.assignment.assignment_type?.name}</Badge>
            </InfoLine>
            <Divider className={'my-4'} />
            <InfoHead
              right={
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={'outline'} size={'icon'}>
                      <Plus/>
                    </Button>
                  </DialogTrigger>
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
                              render={({ field, fieldState }) => {
                                return (
                                  <>
                                    <VFormField required label={'Date'} for={'date'} error={fieldState.error?.message}>
                                      <DatePicker value={field.value} onChange={(date) => field.onChange(date)} />
                                    </VFormField>
                                  </>
                                );
                              }}
                              name={'date'}
                            />
                          </div>
                          <div className={'col-span-12 md:col-span-6'}>
                            <VFormField
                              label={'Days and Overnights'}
                              for={'hours'}
                              error={form.formState.errors.days?.message || form.formState.errors.overnights?.message}
                            >
                              <Inputs>
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'Day'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'days'}
                                />
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'Overnight'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'overnights'}
                                />
                              </Inputs>
                            </VFormField>
                          </div>
                          <div className={'col-span-12 md:col-span-12'}>
                            <VFormField
                              required
                              label={'Hours'}
                              error={
                                form.formState.errors.work_hours?.message ||
                                form.formState.errors.travel_hours?.message ||
                                form.formState.errors.report_hours?.message
                              }
                            >
                              <Inputs>
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'Work'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'work_hours'}
                                />
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'Travel'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'travel_hours'}
                                />
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'Other'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'report_hours'}
                                />
                              </Inputs>
                            </VFormField>
                          </div>
                          <div className={'col-span-12 md:col-span-12'}>
                            <VFormField label={'KM Traveled'} for={'km_traveled'}>
                              <Inputs>
                                <FormField
                                  control={form.control}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <Input placeholder={'KM/Mileage'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                        <Input placeholder={'Rate'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                        <Input placeholder={'Cost'} min={0} type={'number'} value={field.value} onChange={field.onChange} />
                                      </>
                                    );
                                  }}
                                  name={'km_traveled'}
                                />
                              </Inputs>
                            </VFormField>
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
              }
            >
              Time and travel
            </InfoHead>
            <div className={'h-32 relative text-muted-foreground rounded-lg flex items-center justify-center'}>
              <div className={'absolute inset-0 overflow-hidden opacity-10'}>
                <SvgBg/>
              </div>
              No timesheet recorded yet.
            </div>
            <Divider className={'my-4'} />
            <InfoHead
              right={
                <>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={'outline'} size={'icon'}>
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Expenses</DialogTitle>
                        <DialogDescription>Please be sure to fill in correctly the expenses for this assignment.</DialogDescription>
                      </DialogHeader>
                      <DialogInnerContent>
                      </DialogInnerContent>
                      <DialogFooter>
                        <DialogClose>Cancel</DialogClose>
                        <Button onClick={() => {}}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              }
            >
              Expenses
            </InfoHead>
            <div className={'h-32 relative text-muted-foreground rounded-lg flex items-center justify-center'}>
              <div className={'absolute inset-0 overflow-hidden opacity-10'}>
                <SvgBg/>
              </div>
              No expenses recorded yet.
            </div>
          </Info>
        </div>
      </div>
      <div className={'sticky bottom-0 left-0 right-0 py-4 bg-background/10 border-t backdrop-blur-2xl'}>
        <div className={'mx-auto max-w-2xl flex items-center gap-2 justify-center sm:justify-start flex-wrap px-6 sm:px-0'}>
          {/*<Button variant={'outline'} size={'icon'}>*/}
          {/*  <ChevronLeft className={'size-4'} />*/}
          {/*</Button>*/}

          {/*<Button variant={'outline'}>*/}
          {/*  {(new Date()).toLocaleDateString('en-US', {*/}
          {/*    weekday: 'long',*/}
          {/*    month: 'long',*/}
          {/*    day: 'numeric',*/}
          {/*  })}*/}
          {/*</Button>*/}

          {/*<Button variant={'outline'} size={'icon'}>*/}
          {/*  <ChevronRight className={'size-4'} />*/}
          {/*</Button>*/}

          <div className={'hidden sm:inline-block sm:flex-grow'} />

          <Button className={'w-full sm:w-fit'}>
            Submit your timesheet
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
}
