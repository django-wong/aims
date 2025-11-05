import { DatePicker } from '@/components/date-picker';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { useTimesheet } from '@/providers/timesheet-provider';
import { DialogFormProps, TimesheetReport } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toFormData } from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  timesheet_id: z.number().optional(),
  type: z.string().optional(),
  doc_no: z.string().optional().nullable(),
  rev: z.string().optional().nullable(),
  attachment: z.file().optional().nullable(),
  visit_date: z.string().optional().nullable(),
  report_no: z.string().optional().nullable(),
  vendor_id: z.number().optional().nullable(),
  raised_by: z.string().optional().nullable(),
  rev_date: z.string().optional().nullable(),
  is_closed: z.coerce.number().optional(),
});

export function TimesheetReportForm(props: DialogFormProps & { type?: string }) {
  const timesheet = useTimesheet();

  const [open, setOpen] = useState(false);

  const form = useReactiveForm<z.infer<typeof schema>, TimesheetReport>({
    ...useResource('/api/v1/timesheet-reports', {
      timesheet_id: timesheet?.id,
      type: props.type,
      ...props.value,
      attachment: null,
    }),
    serialize: (data) => {
      return toFormData(data);
    },
    resolver: zodResolver(schema) as any,
  });

  function save() {
    form.handleSubmit(() => {
      form.submit().then((response) => {
        if (response) {
          props.onSubmit?.(response.data as TimesheetReport);
          setOpen(false);
        }
      });
    })();
  }

  const footer = (
    <>
      <DialogClose>Close</DialogClose>
      <Button onClick={save}>Save</Button>
    </>
  );

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        footer={footer}
        trigger={props.children}
        title={'Report'}
        description={'Manage timesheet report'}
      >
        <Form {...form}>
          <div className={'grid grid-cols-12 gap-6'}>
            {props.value ? null : (
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <VFormField label="Report Type">
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key={1} value="inspection-report">
                            Inspection Report (IR)
                          </SelectItem>
                          <SelectItem key={2} value="punch-list">
                            Punch List (PL)
                          </SelectItem>
                          <SelectItem key={3} value="hse-report">
                            HSE Report (HSE)
                          </SelectItem>
                          <SelectItem key={4} value="ncr">
                            Non-Conformance Report (NCR)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </VFormField>
                  )}
                />
              </div>
            )}

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="doc_no"
                render={({ field }) => (
                  <VFormField label="Document Number">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="report_no"
                render={({ field }) => (
                  <VFormField label="Report Number">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="rev"
                render={({ field }) => (
                  <VFormField label="Revision">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="rev_date"
                render={({ field }) => (
                  <VFormField label="Revision Date">
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : null)}
                    />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <VFormField label="Visit Date">
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : null)}
                    />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="raised_by"
                render={({ field }) => (
                  <VFormField label="Raised By">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <VFormField label="Attachment / Reversion File">
                    <Input className={'hover:opacity-60'} type="file" multiple={false} onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="is_closed"
                render={({ field }) => (
                  <VFormField
                    label="Report Status"
                    description="Mark this report as closed when completed"
                    className="flex flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </VFormField>
                )}
              />
            </div>
          </div>
        </Form>
      </DialogWrapper>
    </>
  );
}
