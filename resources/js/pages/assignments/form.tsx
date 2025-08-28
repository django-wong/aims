import { AssignmentTypeSelect } from '@/components/assignment-type-select';
import { ContactSelect } from '@/components/contact-select';
import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Editor } from '@/components/editor';
import { OrgSelect } from '@/components/org-select';
import { ProjectSelect } from '@/components/project-select';
import { PurchaseOrderSelect } from '@/components/purchase-order-select';
import { Accordion, AccordionContent, AccordionInnerContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { InspectorSelect } from '@/components/user-select';
import { VendorSelect } from '@/components/vendor-select';
import { VFormField } from '@/components/vform';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { Assignment, DialogFormProps } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const schema = z.object({
  project_id: z.number('Project is required').int().positive(),
  assignment_type_id: z.number().int().positive(),

  operation_org_id: z.number().int().positive().nullable(),

  delegates: z.array(
    z.object({
      org_id: z.number().int().positive(),
      name: z.string().optional(),
    })
  ),

  inspectors: z.array(
    z.object({
      user_id: z.number().int().positive(),
      assignment_type_id: z.number().min(0),
      name: z.string().optional(),
    }),
  ),

  vendor_id: z.number().int().positive().nullable(),
  purchase_order_id: z.number().int().positive().nullable(),
  sub_vendor_id: z.number().int().positive().nullable(),

  // 'report_required': z.boolean(),

  // Visit fields
  first_visit_date: z.string().nullable().optional(),
  visit_frequency: z.string().nullable().optional(),
  total_visits: z.number().int().positive().nullable().optional(),
  hours_per_visit: z.number().int().min(0).max(24).positive().nullable().optional(),
  visit_contact_id: z.number().int().positive().nullable().optional(),

  // Scope of assignment (booleans)
  pre_inspection_meeting: z.boolean().optional(),
  final_inspection: z.boolean().optional(),
  dimensional: z.boolean().optional(),
  sample_inspection: z.boolean().optional(),
  witness_of_tests: z.boolean().optional(),
  monitoring: z.boolean().optional(),
  packing: z.boolean().optional(),
  document_review: z.boolean().optional(),
  expediting: z.boolean().optional(),
  audit: z.boolean().optional(),

  // Status/flash report/exit call
  exit_call: z.boolean().optional(),
  flash_report: z.boolean().optional(),
  contact_details: z.string().nullable().optional(),
  contact_email: z.string().email().nullable().optional(),

  // Reporting fields
  reporting_format: z.number().int().optional(),
  reporting_frequency: z.number().int().optional(),
  send_report_to_email: z.string().email().nullable().optional(),
  timesheet_format: z.number().int().optional(),
  ncr_format: z.number().int().optional(),
  punch_list_format: z.number().int().optional(),
  irn_format: z.number().int().optional(),
  document_stamp: z.number().int().optional(),

  equipment: z.string().min(14).nullable().optional(),
  notes: z.string().max(1500).nullable().optional(),
  special_notes: z.string().nullable().optional(),
  inter_office_instructions: z.string().max(1500).nullable().optional(),
  inspector_instructions: z.string().max(1500).nullable().optional(),
});

export function AssignmentForm(props: DialogFormProps<Assignment>) {
  const form = useReactiveForm<z.infer<typeof schema>, Assignment>({
    ...useResource('/api/v1/assignments', {
      operation_org_id: null,
      inspectors: [],
      sub_vendor_id: null,
      vendor_id: null,
      notes: '',
      report_required: false,
      ...props.value,
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
      form.setValue('inspectors', []);
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
    });
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
                <div className={'col-span-12'}>
                  <RadioGroup defaultValue={mode} onValueChange={setMode} orientation={'horizontal'}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="assign" id="r1" />
                      <Label htmlFor="r1">Assign to inspector</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="delegate" id="r2" />
                      <Label htmlFor="r2">Delegate</Label>
                    </div>
                  </RadioGroup>
                </div>
                {
                  mode === 'delegate' ? (
                    <FormField
                      name={'operation_org_id'}
                      control={form.control}
                      render={({ field }) => (
                        <>
                          <VFormField
                            label={'Operation Office'}
                            className={'col-span-12'}
                            description={'Operation office will decide who will be the coordinator and inspector.'}
                          >
                            <OrgSelect placeholder={'Choose an operation office'} onValueChane={field.onChange} value={field.value} />
                          </VFormField>
                        </>
                      )}
                    />
                  ) : (
                    <div className={'col-span-12 grid grid-cols-1 gap-4'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <div className={'w-full'}>
                              <AllInspectors
                                value={field.value}
                                onRemove={(value) => {
                                  field.onChange((field.value ?? []).filter((item) => item != value));
                                }}
                              />
                              <AddInspectorForm
                                onValueChange={(value) => {
                                  field.onChange([...field.value, value]);
                                }}
                              >
                                <Button className={'w-full'}>
                                  <PlusIcon /> Add Inspector
                                </Button>
                              </AddInspectorForm>
                              <FormMessage />
                            </div>
                          );
                        }}
                        name={'inspectors'}
                      />
                    </div>
                  )
                }
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
                        <AccordionInnerContent className={'grid grid-cols-12 gap-4'}>
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Contact Name'} className={'col-span-12'}>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder="Contact person name" />
                              </VFormField>
                            )}
                            name={'contact_details'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Contact Email'} className={'col-span-12'}>
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
                        </AccordionInnerContent>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Input type="email" value={field.value || ''} onChange={field.onChange} placeholder="report@example.com" />
                              </VFormField>
                            )}
                            name={'send_report_to_email'}
                          />
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField label={'Timesheet Format'} className={'col-span-6'}>
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                                <div className={'bg-background overflow-hidden rounded-md border'}>
                                  <Editor value={field.value ?? DEFAULT_SPACIAL_NOTES} />
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

const DEFAULT_SPACIAL_NOTES = `
<p>Report (in sentence case lettering) must be submitted to the BIE office by 10:00 hrs on the day following the visit with all relevant documents attached. A flash email must be sent, and an exit call made if required. <br/></p>

<p><strong>Specifications / Drawings & Data Sheets:</strong></p>

<p>
  1: xxxxx<br/>
  2: xxxxx<br/>
</p>

<p><strong>Notes:</strong></p>

<ul>
  <li>1. With each visit an inspection report shall be sent within 48 hours. If there is more than one visit in a week on the same inspection assignment a single report at the end of the week will suffice for each assignment, provided flash report for each visit at the end of the day.</li>
  <li>2. Problems arising from Inspection visits that require urgent resolution shall be reported immediately via telephone or e-mail to Wood from Suppliers works at each visit.</li>
  <li>3. Inspection and test records shall be progressively signed off and following with ITP sign off (No separate visit for MDR review) prior to release.</li>
  <li>4. The ITP should be signed off against all R, W and H points, where the inspector visited to monitor an activity these should also be signed off.</li>
  <li>5. Inspection Release Note shall only be issued directly to Wood unless specific instruction given for the package. Inspector must report to Wood before leaving the premises if any issues have been identified which could potentially impact the release.</li>
  <li>6. Final Inspection release certificate will only be issued to Supplier, after confirming by Wood Quality Advisor that all SDRL documents are approved.</li>
  <li>7. The final signed off ITP should be submitted along with the release note.</li>
</ul>

<p><strong>Comments:</strong></p>
<p>
Weekly inspection of one day a week progressing to two days once testing starts <br/>
Review material certificates and accept on Woods behalf <br/>
Review test certificates and accept on Woods behalf <br/>
Witness testing <br/>
Inspect Modules for compliance with Woodside specifications and Australian regulations <br/>
Progressively sign ITP <br/>
Monitor MDR is being compiled progressively <br/>
Inspect packaging in in compliance with Woodside specifications <br/>
Issue weekly reports and flash reports when required <br/>
Issue IRN to release equipment <br/>
Attend weekly meeting with Wood/client <br/>
</p>

<p><strong>Start Date:</strong></p>
<p>
Pre-Inspection Meeting before start date TBC with inspector for their availability <br/>
TBA – October <br/>
</p>

<p><strong>Client Requirements:</strong></p>
<p>
Subject in Emails must contain the BIE and Client inspection assignment numbers, client PO Number, Vendor Details and equipment description. example: WOOD_W97330_ABB_BIE_13146 <br/>
Flash Report to be sent after each visit by inspector via email directly to Client CC. report.au@biegroup.com <br/>
BIE Flash Report, BIE Template format to be used. <br/>
Formal Client Inspection Report and Release forms are to be used and are to be sent to client by BIE. <br/>
Report Numbering Format & File Name of report must be in accordance with client requirements: <br/>
<br/>
EXAMPLES for reports. flash reports / release notes: <br/>
Flash report: WOOD_W97330_ABB_BIE_13146_FR-01… 02… etc <br/>
Inspection Report: WOOD_W97330_ABB_BIE_13146_IR-01… 02… etc <br/>
Release: WOOD_W97330_ABB_BIE_13146_IRC-01… 02… etc <br/>
<br/>
<strong>FLASH REPORTS to be Transmitted Direct to Client - Recipients:</strong> <br/>
Martin Shaw: martin.shaw@woodplc.com <br/>
cc. Hoascar, Bianca bianca.hoascar@woodplc.com  / reports.au@biegroup.com <br/>
<br/>
<strong>The Flash Email Report must take the following format:</strong><br/>
CLIENT P.O. NO:………………………………………. <br/>
BIE REFERENCE NO: …………………………………. <br/>
VENDOR NAME:…………………………………… <br/>
INSPECTION LOCATION:………………………… <br/>
INSPECTOR NAME:……………………………… <br/>
DATE OF INSPECTION:…………………………… <br/>
P.O. ITEM NO. & BRIEF DESCRIPTION:……. <br/>
ITP ACTIVITY NO.: …………………………………………. <br/>
INSPECTION RESULT ACCEPTABLE:       YES/NO <br/>
REASON NOT ACCEPTABLE: <br/>
</p>

<p><strong>Note: This must be in the body of the email and NOT in the form of an email attachment.</strong></p>
`.trim();

const add_inspector_schema = z.object({
  user_id: z.number().min(1, 'Inspector is required'),
  assignment_type_id: z.number().min(1),
  name: z.string().optional(),
});

function AddInspectorForm(props: {
  onValueChange?: (value: { user_id: number; name?: string; assignment_type_id: number }) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof add_inspector_schema>>({
    defaultValues: {},
    resolver: zodResolver(add_inspector_schema),
  });

  function save() {
    form.handleSubmit((data) => {
      if (data) {
        props.onValueChange?.(data);
        setOpen(false);
      }
    })();
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inspector</DialogTitle>
            <DialogDescription>Fill in the details below to add inspector the the assignment.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-6'}>
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField label={'Inspector'} className={'col-span-12'}>
                        <InspectorSelect
                          onValueChane={() => {}}
                          onDataChange={(user) => {
                            field.onChange(user?.id || null);
                            form.setValue('name', user?.name);
                          }}
                          value={field.value}
                        />
                      </VFormField>
                    );
                  }}
                  name={'user_id'}
                />
                <FormField
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <VFormField label={'Discipline'} className={'col-span-12'}>
                        <AssignmentTypeSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    );
                  }}
                  name={'assignment_type_id'}
                />
              </div>
            </Form>
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AllInspectorsProps {
  value?: Array<{
    user_id: number;
    assignment_type_id: number;
    name?: string;
  }>;
  onRemove: (value: { user_id: number; assignment_type_id: number; name?: string }) => void;
}
function AllInspectors(props: AllInspectorsProps) {
  return (
    <div className={'mb-2 flex items-start justify-start gap-4'}>
      {props.value?.map((item, index) => {
        return (
          <Badge
            variant={'secondary'}
            key={index}
            onClick={() => {
              props.onRemove(item);
            }}
          >
            {item.name}
            <XIcon />
          </Badge>
        );
      })}
    </div>
  );
}
