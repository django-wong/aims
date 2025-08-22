import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Assignment, DialogFormProps } from '@/types';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { ProjectSelect } from '@/components/project-select';
import { VendorSelect } from '@/components/vendor-select';
import { Textarea } from '@/components/ui/textarea';
import { StaffSelect } from '@/components/user-select';
import { OrgSelect } from '@/components/org-select';
import { AssignmentTypeSelect } from '@/components/assignment-type-select';
import { useEffect, useState } from 'react';
import { PurchaseOrderSelect } from '@/components/purchase-order-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ContactSelect } from '@/components/contact-select';
import { DatePicker } from '@/components/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Editor } from '@/components/editor';

const schema = z.object({
  'project_id': z.number('Project is required').int().positive(),
  'assignment_type_id': z.number().int().positive(),

  'operation_org_id': z.number().int().positive().nullable(),
  'inspector_id': z.number().int().positive().nullable(),

  'vendor_id': z.number().int().positive().nullable(),
  'purchase_order_id': z.number().int().positive().nullable(),
  'sub_vendor_id': z.number().int().positive().nullable(),

  // 'report_required': z.boolean(),

  // Visit fields
  'first_visit_date': z.string().nullable().optional(),
  'visit_frequency': z.string().nullable().optional(),
  'total_visits': z.number().int().positive().nullable().optional(),
  'hours_per_visit': z.number().int().min(0).max(24).positive().nullable().optional(),
  'visit_contact_id': z.number().int().positive().nullable().optional(),

  // Scope of assignment (booleans)
  'pre_inspection_meeting': z.boolean().optional(),
  'final_inspection': z.boolean().optional(),
  'dimensional': z.boolean().optional(),
  'sample_inspection': z.boolean().optional(),
  'witness_of_tests': z.boolean().optional(),
  'monitoring': z.boolean().optional(),
  'packing': z.boolean().optional(),
  'document_review': z.boolean().optional(),
  'expediting': z.boolean().optional(),
  'audit': z.boolean().optional(),

  // Status/flash report/exit call
  'exit_call': z.boolean().optional(),
  'flash_report': z.boolean().optional(),
  'contact_details': z.string().nullable().optional(),
  'contact_email': z.string().email().nullable().optional(),

  // Reporting fields
  'reporting_format': z.number().int().optional(),
  'reporting_frequency': z.number().int().optional(),
  'send_report_to_email': z.string().email().nullable().optional(),
  'timesheet_format': z.number().int().optional(),
  'ncr_format': z.number().int().optional(),
  'punch_list_format': z.number().int().optional(),
  'irn_format': z.number().int().optional(),
  'document_stamp': z.number().int().optional(),

  'equipment': z.string().min(14).nullable().optional(),
  'notes': z.string().max(1500).nullable().optional(),
  'special_notes': z.string().nullable().optional(),
  'inter_office_instructions': z.string().max(1500).nullable().optional(),
  'inspector_instructions': z.string().max(1500).nullable().optional(),
});

export function AssignmentForm(props: DialogFormProps<Assignment>) {
  const form = useReactiveForm<z.infer<typeof schema>, Assignment>({
    ...useResource('/api/v1/assignments', {
      operation_org_id: null,
      inspector_id: null,
      sub_vendor_id: null,
      vendor_id: null,
      notes: '',
      report_required: false,
      ...props.value
    }),
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (props.value) {
      form.reset(props.value);
    }
  }, [props.value]);

  const [mode, setMode] = useState(props.value?.operation_org_id ? 'delegate' : 'assign');

  useEffect(() => {
    if (mode === 'assign') {
      form.setValue('operation_org_id', null);
    } else {
      form.setValue('inspector_id', null);
    }
  }, [mode]);

  const [open, _setOpen] = useState(props.open || false);

  function setOpen(value: boolean) {
    _setOpen(value);
    props.onOpenChange?.(value);
  }

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        setOpen(false);
        props.onSubmit(response.data);
      }
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment</DialogTitle>
            <DialogDescription>Fill in the necessary details and submit.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-6'}>
                <FormField
                  name={'project_id'}
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <VFormField required label={'Project'} className={'col-span-12'}>
                        <ProjectSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'purchase_order_id'}
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <VFormField required label={'Purchase Order'} className={'col-span-12'}>
                        <PurchaseOrderSelect
                          onValueChane={field.onChange}
                          value={field.value}
                          params={{
                            'filter[project_id]': form.watch('project_id') || '',
                          }}
                        />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'assignment_type_id'}
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <VFormField required label={'Type'} className={'col-span-12'}>
                        <AssignmentTypeSelect value={field.value} onValueChane={field.onChange} />
                      </VFormField>
                    </>
                  )}
                />
                <div className={'bg-background col-span-12 rounded-md border p-4 shadow-xs'}>
                  <Tabs value={mode} onValueChange={setMode}>
                    <TabsList>
                      <TabsTrigger value={'assign'}>Assign to inspector</TabsTrigger>
                      <TabsTrigger disabled value={'delegate'}>
                        Delegate to other office (coming soon)
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value={'assign'}>
                      <FormField
                        name={'inspector_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField>
                              <StaffSelect placeholder={'Choose an inspector'} onValueChane={field.onChange} value={field.value} />
                            </VFormField>
                          </>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value={'delegate'}>
                      <FormField
                        name={'operation_org_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField>
                              <OrgSelect placeholder={'Choose an operation office'} onValueChane={field.onChange} value={field.value} />
                            </VFormField>
                          </>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                <FormField
                  name={'vendor_id'}
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <VFormField label={'Vendor'} className={'col-span-6'}>
                        <VendorSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'sub_vendor_id'}
                  control={form.control}
                  render={({ field }) => (
                    <>
                      <VFormField label={'Sub Vendor'} className={'col-span-6'}>
                        <VendorSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                {/*<FormField*/}
                {/*  name={'notes'}*/}
                {/*  control={form.control}*/}
                {/*  render={({ field }) => (*/}
                {/*    <>*/}
                {/*      <VFormField label={'Notes'} className={'col-span-12'}>*/}
                {/*        <Textarea*/}
                {/*          className={'bg-background min-h-36'}*/}
                {/*          value={field.value ?? ''}*/}
                {/*          onChange={field.onChange}*/}
                {/*          placeholder={'Describe any notes or additional information about the assignment.'}*/}
                {/*        />*/}
                {/*      </VFormField>*/}
                {/*    </>*/}
                {/*  )}*/}
                {/*/>*/}
                <div className={'col-span-12'}>
                  <Accordion type={'multiple'}>
                    <AccordionItem value={'equipment'}>
                      <AccordionTrigger>Equipment</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField>
                                <Input value={field.value || ''} onChange={field.onChange}></Input>
                              </VFormField>
                            );
                          }}
                          name={'equipment'}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={'inter-office-instructions'}>
                      <AccordionTrigger>Inter-Office Instructions</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField>
                                <Textarea value={field.value || ''} onChange={field.onChange}></Textarea>
                              </VFormField>
                            );
                          }}
                          name={'inter_office_instructions'}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={'inspector-instructions'}>
                      <AccordionTrigger>Inspector Instructions</AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField>
                                <Textarea value={field.value || ''} onChange={field.onChange}></Textarea>
                              </VFormField>
                            );
                          }}
                          name={'inspector_instructions'}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={'visit-details'}>
                      <AccordionTrigger>Visit Details</AccordionTrigger>
                      <AccordionContent>
                        <div className={'grid grid-cols-12 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'First Visit Date'} className={'col-span-6'}>
                                <DatePicker
                                  value={field.value || undefined}
                                  onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                                />
                              </VFormField>
                            )}
                            name={'first_visit_date'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Visit Frequency'} className={'col-span-6'}>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="e.g., weekly, monthly" />
                              </VFormField>
                            )}
                            name={'visit_frequency'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Total Visits'} className={'col-span-6'}>
                                <Input
                                  type="number"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                />
                              </VFormField>
                            )}
                            name={'total_visits'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Hours Per Visit'} className={'col-span-6'}>
                                <Input
                                  type="number"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                />
                              </VFormField>
                            )}
                            name={'hours_per_visit'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Contact Person'} className={'col-span-12'}>
                                <ContactSelect
                                  onValueChane={field.onChange}
                                  value={field.value || null}
                                  params={{
                                    contactable_type: 'client',
                                    contactable_id: `{project.${form.watch('project_id')}.client_id}`,
                                  }}
                                />
                              </VFormField>
                            )}
                            name={'visit_contact_id'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={'scope-of-assignment'}>
                      <AccordionTrigger>Scope of Assignment</AccordionTrigger>
                      <AccordionContent>
                        <div className={'grid grid-cols-2 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="pre_inspection_meeting" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="pre_inspection_meeting" className="text-sm font-medium">
                                  Pre-inspection Meeting
                                </label>
                              </div>
                            )}
                            name={'pre_inspection_meeting'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="final_inspection" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="final_inspection" className="text-sm font-medium">
                                  Final Inspection
                                </label>
                              </div>
                            )}
                            name={'final_inspection'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="dimensional" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="dimensional" className="text-sm font-medium">
                                  Dimensional
                                </label>
                              </div>
                            )}
                            name={'dimensional'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="sample_inspection" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="sample_inspection" className="text-sm font-medium">
                                  Sample Inspection
                                </label>
                              </div>
                            )}
                            name={'sample_inspection'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="witness_of_tests" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="witness_of_tests" className="text-sm font-medium">
                                  Witness of Tests
                                </label>
                              </div>
                            )}
                            name={'witness_of_tests'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="monitoring" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="monitoring" className="text-sm font-medium">
                                  Monitoring
                                </label>
                              </div>
                            )}
                            name={'monitoring'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="packing" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="packing" className="text-sm font-medium">
                                  Packing
                                </label>
                              </div>
                            )}
                            name={'packing'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="document_review" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="document_review" className="text-sm font-medium">
                                  Document Review
                                </label>
                              </div>
                            )}
                            name={'document_review'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="expediting" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="expediting" className="text-sm font-medium">
                                  Expediting
                                </label>
                              </div>
                            )}
                            name={'expediting'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Checkbox id="audit" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="audit" className="text-sm font-medium">
                                  Audit
                                </label>
                              </div>
                            )}
                            name={'audit'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={'status-flash-report'}>
                      <AccordionTrigger>Status / Flash Report / Exit Call</AccordionTrigger>
                      <AccordionContent>
                        <div className={'grid grid-cols-12 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Contact Name'} className={'col-span-6'}>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="Contact person name" />
                              </VFormField>
                            )}
                            name={'contact_details'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Contact Email'} className={'col-span-6'}>
                                <Input type="email" value={field.value || ''} onChange={field.onChange} placeholder="contact@example.com" />
                              </VFormField>
                            )}
                            name={'contact_email'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="col-span-6 flex items-center space-x-2">
                                <Checkbox id="exit_call" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="exit_call" className="text-sm font-medium">
                                  Exit Call Required
                                </label>
                              </div>
                            )}
                            name={'exit_call'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <div className="col-span-6 flex items-center space-x-2">
                                <Checkbox id="flash_report" checked={field.value || false} onCheckedChange={field.onChange} />
                                <label htmlFor="flash_report" className="text-sm font-medium">
                                  Flash Report Required
                                </label>
                              </div>
                            )}
                            name={'flash_report'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={'reporting'}>
                      <AccordionTrigger>Reporting</AccordionTrigger>
                      <AccordionContent>
                        <div className={'grid grid-cols-12 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Reporting Format'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select reporting format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE</SelectItem>
                                    <SelectItem value="1">Client</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'reporting_format'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Reporting Frequency'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select reporting frequency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">Daily</SelectItem>
                                    <SelectItem value="1">Weekly</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'reporting_frequency'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Send Report To Email'} className={'col-span-12'}>
                                <Input
                                  type="email"
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="report@example.com"
                                />
                              </VFormField>
                            )}
                            name={'send_report_to_email'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Timesheet Format'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select timesheet format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE</SelectItem>
                                    <SelectItem value="1">Client</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'timesheet_format'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'NCR Format'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select NCR format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE</SelectItem>
                                    <SelectItem value="1">Client</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'ncr_format'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Punch List Format'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select punch list format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE</SelectItem>
                                    <SelectItem value="1">Client</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'punch_list_format'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'IRN Format'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select IRN format" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE</SelectItem>
                                    <SelectItem value="1">Client</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'irn_format'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Document Stamp'} className={'col-span-6'}>
                                <Select
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  value={field.value?.toString() || '0'}
                                >
                                  <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select document stamp" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0">BIE Stamp</SelectItem>
                                    <SelectItem value="1">Sign</SelectItem>
                                  </SelectContent>
                                </Select>
                              </VFormField>
                            )}
                            name={'document_stamp'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={'notes'}>
                      <AccordionTrigger>Notes</AccordionTrigger>
                      <AccordionContent>
                        <div className={'grid grid-cols-12 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'General Notes'} className={'col-span-12'}>
                                <Textarea
                                  value={field.value || ''}
                                  onChange={field.onChange}
                                  placeholder="General notes about the assignment"
                                  className="min-h-24"
                                />
                              </VFormField>
                            )}
                            name={'notes'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Special Notes'} className={'col-span-12'}>
                                {/*<Textarea*/}
                                {/*  value={field.value || ''}*/}
                                {/*  onChange={field.onChange}*/}
                                {/*  placeholder="Special notes will be included in the assignment form."*/}
                                {/*  className="min-h-24"*/}
                                {/*/>*/}
                                <div className={'rounded-md border bg-background overflow-hidden'}>
                                  <Editor value={field.value ?? ''}/>
                                </div>
                              </VFormField>
                            )}
                            name={'special_notes'}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Form>
          </DialogInnerContent>
          <DialogFooter className={'flex-row items-center'}>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={form.formState.disabled || form.formState.isSubmitting} onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
