import { ContactSelect } from '@/components/contact-select';
import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Editor } from '@/components/editor';
import { OrgSelect } from '@/components/org-select';
import { ProjectSelect } from '@/components/project-select';
import { PurchaseOrderSelect } from '@/components/purchase-order-select';
import { SkillSelect } from '@/components/skill-select';
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
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StaffSelect } from '@/components/user-select';
import { VendorSelect } from '@/components/vendor-select';
import { VFormField } from '@/components/vform';
import { objectToFormData, useReactiveForm, useResource } from '@/hooks/use-form';
import { Assignment, DialogFormProps, SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { RefreshCcw } from 'lucide-react';
import { PropsWithChildren, startTransition, useCallback, useEffect, useState } from 'react';
import z from 'zod';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { usePage } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import { QuickNewContactButton } from '@/pages/contacts/quick-new-contact-button';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const schema = z.object({
  reference_number: z.string().min(1, 'Reference number is required').max(30, 'Reference number must be at most 30 characters'),
  previous_reference_number: z.string().max(30, 'Previous reference number must be at most 30 characters').nullable().optional(),

  delegated: z.boolean(),

  project_id: z.number('Project is required').int().positive(),

  coordinator_id: z.number().int().positive(),

  // Delegate to operation (coordinating) office
  operation_org_id: z.number().int().positive().nullable(),
  operation_coordinator_id: z.number().int().positive().nullable().optional(),

  inspectors: z.array(
    z.object({
      user_id: z.number().min(1, { message: 'Inspector is required' }),
      assignment_type_id: z.number().min(1, { message: 'Discipline is required' }),
    })
  ).nullable().optional(),

  skill_id: z.number().int().positive().nullable().optional(),

  vendor_id: z.number().int().positive().nullable(),
  purchase_order_id: z.number().int().positive(),
  sub_vendor_id: z.number().int().positive().nullable(),

  client_po: z.string().max(30).nullable().optional(),
  client_po_rev: z.string().max(10).nullable().optional(),
  po_delivery_date: z.string().nullable().optional(),
  close_date: z.string().nullable().optional(),
  final_invoice_date: z.string().nullable().optional(),

  attachments: z.array(z.file()).nullable().optional(),

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
  report_required: z.coerce.boolean().optional().nullable(),
  exit_call: z.boolean().optional(),
  flash_report: z.boolean().optional(),
  client_contact_id: z.number().int().positive().nullable().optional(),

  // Reporting fields
  reporting_format: z.number().int().optional(),
  reporting_frequency: z.number().int().optional(),
  send_report_to: z.coerce.number().nullable().optional(),
  timesheet_format: z.number().int().optional(),
  ncr_format: z.number().int().optional(),
  punch_list_format: z.number().int().optional(),
  irn_format: z.number().int().optional(),
  document_stamp: z.number().int().optional(),
  issue_irn_to_vendor: z.number().int().optional(),

  equipment: z.string().min(14).nullable().optional(),
  notes: z.string().max(1500).nullable().optional(),
  special_notes: z.string().nullable().optional(),

  inter_office_instructions: z.string().max(1500).nullable().optional(),
  inspector_instructions: z.string().max(1500).nullable().optional(),
});

const defaultValue: Partial<z.infer<typeof schema>> = {
  operation_org_id: null,
  reference_number: '',
  inspectors: [],
  sub_vendor_id: null,
  pre_inspection_meeting: false,
  final_inspection: false,
  dimensional: false,
  sample_inspection: false,
  witness_of_tests: false,
  monitoring: false,
  packing: false,
  document_review: false,
  expediting: false,
  audit: false,
  vendor_id: null,
  delegated: false,
  notes: '',
  flash_report: false,
  exit_call: false,
  report_required: false,
  reporting_format: 0,
  reporting_frequency: 0,
  send_report_to: 0,
  timesheet_format: 0,
  ncr_format: 0,
  punch_list_format: 0,
  irn_format: 0,
  document_stamp: 0,
  issue_irn_to_vendor: 0,
};

export function AssignmentForm(props: DialogFormProps<Assignment>) {

  const {
    props: { auth },
  } = usePage<SharedData>();

  const [
    draft, setDraft
  ] = useLocalStorage<z.infer<typeof schema>|null>(`${auth.user?.id}:assignment:draft`, null);

  const isEdit = !!props.value;

  const form = useReactiveForm<z.infer<typeof schema>, Assignment>({
    ...useResource('/api/v1/assignments', {
      ...defaultValue,
      ...props.value,
    }),
    serialize: objectToFormData,
    resolver: zodResolver(schema) as any,
  });


  const i_am_the_operation_office = props.value?.operation_org_id === auth.org?.id;

  useEffect(() => {
    if (props.value) {
      form.reset(props.value as any);
    } else if (draft) {
      form.reset(draft);
    }
  }, [props.value]);

  const [open, _setOpen] = useState(props.open || false);

  function setOpen(value: boolean) {
    _setOpen(value);
    props.onOpenChange?.(value);
  }

  function saveAsDraft() {
    startTransition(() => {
      setDraft({
        ...form.getValues(),
        attachments: [] // attachments are file objects, cannot be saved in local storage
      });
      setOpen(false);
    })
  }

  function reset() {
    setDraft(null);
    form.resetAll(defaultValue);
  }

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        startTransition(() => {
          setDraft(null);
          setOpen(false);
          props.onSubmit?.(response.data);
          if (! props.value) {
            form.resetAll(defaultValue)
          }
        })
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className={'sm:max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>Assignment</DialogTitle>
            <DialogDescription>Fill in the necessary details and submit.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent className={'relative p-0'}>
            <Form {...form}>
              <div className={'px-6 py-4'}>
                <Accordion type={'multiple'} defaultValue={['basic']}>
                  <AccordionItem value={'basic'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Basic Information</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'BIE Reference Number'} required>
                                <ReferenceNumber allowGenerate value={field.value || ''} onValueChange={field.onChange} />
                              </VFormField>
                            );
                          }}
                          name={'reference_number'}
                        />
                      </div>

                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Previous Reference Number'}>
                                <Input value={field.value || ''} onChange={field.onChange}></Input>
                              </VFormField>
                            );
                          }}
                          name={'previous_reference_number'}
                        />
                      </div>

                      <FormField
                        name={'project_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField required label={'Project'} className={'col-span-6'}>
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
                            <VFormField required label={'Work Order'} className={'col-span-6'}>
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
                        name={'coordinator_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField required label={'Coordinator'} className={'col-span-6'}>
                              <StaffSelect onValueChane={field.onChange} value={field.value || null} />
                            </VFormField>
                          </>
                        )}
                      />

                      {i_am_the_operation_office ? null : (
                        <div className={'bg-background col-span-12 grid grid-cols-1 gap-6 rounded-md border p-6 ring-4 ring-muted'}>
                          <FormField
                            render={({ field }) => {
                              return (
                                <Label>
                                  <Switch
                                    required
                                    disabled={isEdit}
                                    checked={field.value}
                                    onCheckedChange={(value) => {
                                      field.onChange(value);
                                      if (!value) {
                                        form.setValue('operation_org_id', null);
                                        form.setValue('operation_coordinator_id', null);
                                      }
                                    }}
                                  />
                                  Delegate to coordination office
                                </Label>
                              );
                            }}
                            control={form.control}
                            name={'delegated'}
                          />

                          {form.watch('delegated') ? (
                            <div className={'grid grid-cols-6 gap-6'}>
                              <FormField
                                name={'operation_org_id'}
                                control={form.control}
                                render={({ field }) => (
                                  <>
                                    <VFormField label={'Coordination Office'} className={'col-span-6'}>
                                      <OrgSelect
                                        onValueChane={field.onChange}
                                        params={{
                                          'filter[id]': '!= :my_org',
                                        }}
                                        value={field.value}
                                      />
                                    </VFormField>
                                  </>
                                )}
                              />

                              {form.watch('operation_org_id') && (
                                <FormField
                                  name={'operation_coordinator_id'}
                                  control={form.control}
                                  render={({ field }) => (
                                    <>
                                      <VFormField
                                        description={'This person will receive the notifications.'}
                                        label={'Coordinator'}
                                        className={'col-span-6'}
                                      >
                                        <StaffSelect
                                          params={{ org: form.watch('operation_org_id') }}
                                          onValueChane={field.onChange}
                                          value={field.value ?? null}
                                        />
                                      </VFormField>
                                    </>
                                  )}
                                />
                              )}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'client-po-vendor-equipment'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Client / PO / Vendor / Equipment</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6 pb-6'}>
                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Client PO'}>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder={'Client purchase order number'} />
                              </VFormField>
                            );
                          }}
                          name={'client_po'}
                        />
                      </div>

                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Client PO Rev'}>
                                <Input value={field.value || ''} onChange={field.onChange} placeholder={'Revision number'} />
                              </VFormField>
                            );
                          }}
                          name={'client_po_rev'}
                        />
                      </div>

                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => (
                            <VFormField label={'PO Delivery Date'}>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                              />
                            </VFormField>
                          )}
                          name={'po_delivery_date'}
                        />
                      </div>

                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => (
                            <VFormField label={'Close Date'}>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                              />
                            </VFormField>
                          )}
                          name={'close_date'}
                        />
                      </div>

                      <div className={'col-span-6'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => (
                            <VFormField label={'Final Invoice Date'}>
                              <DatePicker
                                value={field.value || undefined}
                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : null)}
                              />
                            </VFormField>
                          )}
                          name={'final_invoice_date'}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'equipment'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Equipment</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Equipment'}>
                                <SkillSelect onValueChane={(value) => field.onChange(value)} value={field.value ?? null} />
                              </VFormField>
                            );
                          }}
                          name={'skill_id'}
                        />
                      </div>

                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Description'}>
                                <Input value={field.value || ''} onChange={field.onChange}></Input>
                              </VFormField>
                            );
                          }}
                          name={'equipment'}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'vendors'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Vendors</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
                      <FormField
                        name={'vendor_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField label={'Main Vendor'} className={'col-span-6'}>
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
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'instructions'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Instructions</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Inter-Office Instructions'}>
                                <Textarea value={field.value || ''} onChange={field.onChange}></Textarea>
                              </VFormField>
                            );
                          }}
                          name={'inter_office_instructions'}
                        />
                      </div>
                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <VFormField label={'Inspector Instructions'}>
                                <Textarea value={field.value || ''} onChange={field.onChange}></Textarea>
                              </VFormField>
                            );
                          }}
                          name={'inspector_instructions'}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'visit-details'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Visit Details</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
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
                          <VFormField
                            label={'Contact Person'}
                            className={'col-span-12'}
                            description={"Contact person at the main vendor's side for visit coordination, set up in the vendor contacts if needed."}
                          >
                            {form.watch('vendor_id') ? (
                              <ContactSelect
                                onValueChane={field.onChange}
                                value={field.value || null}
                                params={{
                                  contactable_type: 'vendor',
                                  contactable_id: form.watch('vendor_id'),
                                }}
                                createButton={
                                  <QuickNewContactButton
                                    contactable_type='vendor'
                                    contactable_id={form.watch('vendor_id') || undefined}
                                  />
                                }
                              />
                            ) : (
                              <p>[Select the main vendor to enable this option]</p>
                            )}
                          </VFormField>
                        )}
                        name={'visit_contact_id'}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'scope'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Scope of Assignment</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-2 gap-6'}>
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
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'exit-call'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Status / Flash Report / Exit Call</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
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
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <div className="col-span-6 flex items-center space-x-2">
                            <Checkbox id="report_required" checked={field.value || false} onCheckedChange={field.onChange} />
                            <label htmlFor="report_required" className="text-sm font-medium">
                              Report Required
                            </label>
                          </div>
                        )}
                        name={'report_required'}
                      />
                      {
                        form.watch('project_id') ? (
                          <FormField
                            control={form.control}
                            render={({ field }) => (
                              <VFormField
                                label={'Contact Person'}
                                className={'col-span-12'}
                                description={'Contact person at the client side for exit call, set up in the client contacts if needed.'}
                              >
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
                            name={'client_contact_id'}
                          />
                        ) : null
                      }
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'reporting'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Reporting Format</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={'grid grid-cols-12 gap-6'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <VFormField label={'Reporting Format'} className={'col-span-6'}>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                          <VFormField label={'Send report to'} className={'col-span-6'}>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
                                <SelectValue placeholder="Select timesheet format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">BIE</SelectItem>
                                <SelectItem value="1">Client</SelectItem>
                                <SelectItem value="2">BIE & Client</SelectItem>
                              </SelectContent>
                            </Select>
                          </VFormField>
                        )}
                        name={'send_report_to'}
                      />
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <VFormField label={'Timesheet Format'} className={'col-span-6'}>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
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
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <VFormField label={'Issue IRN to Vendor'} className={'col-span-6'}>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                              <SelectTrigger className={'bg-background w-full'}>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">NO</SelectItem>
                                <SelectItem value="1">YES</SelectItem>
                              </SelectContent>
                            </Select>
                          </VFormField>
                        )}
                        name={'issue_irn_to_vendor'}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'attachments'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Add Attachments</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={''}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <>
                              <VFormField description={'Files will be share with inspectors'}>
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
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'notes'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Notes</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={''}>
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <VFormField>
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
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value={'special'}>
                    <AccordionTrigger>
                      <AssignmentSectionHead>Special Notes</AssignmentSectionHead>
                    </AccordionTrigger>
                    <AccordionContent className={''}>
                      <FormField
                        control={form.control}
                        render={({ field }) => (
                          <Editor className={'bg-background rounded-md border'} value={field.value ?? ''} onChange={field.onChange} />
                        )}
                        name={'special_notes'}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Form>
          </DialogInnerContent>
          <DialogFooter className={'flex-row items-center'}>
            <Button variant={'destructive'} onClick={reset}>
              Reset
            </Button>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'outline'} onClick={saveAsDraft}>
                  Save as Draft
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Save your work as a draft. Please note attachments will not be saved.
              </TooltipContent>
            </Tooltip>
            <Button disabled={form.formState.disabled || form.formState.isSubmitting} onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ReferenceNumberProps {
  value: string;
  onValueChange: (value: string) => void;
  allowGenerate?: boolean;
}

function ReferenceNumber({ value, onValueChange, ...props }: ReferenceNumberProps) {
  const generate = useCallback(() => {
    axios.get('/api/v1/assignments/next-assignment-number').then((response) => {
      if (response.data) {
        onValueChange(response.data.data);
      }
    });
  }, [onValueChange]);

  useEffect(() => {
    if (!value && props.allowGenerate) {
      generate();
    }
  }, [props.allowGenerate, value, generate]);

  return (
    <div className={'flex items-center gap-2'}>
      <Input
        className={'flex-1'}
        placeholder={'YYYY-AUS-1234'}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
        }}
      />
      <Button variant={'outline'} onClick={generate} disabled={!props.allowGenerate}>
        <RefreshCcw />
      </Button>
    </div>
  );
}

function AssignmentSectionHead(props: PropsWithChildren) {
  return (
    <>
      <div className={'font-bold'}>{props.children}</div>
    </>
  );
}
