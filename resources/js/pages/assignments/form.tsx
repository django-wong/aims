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
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { Assignment, DialogFormProps, SharedData } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import z from 'zod';
import { RefreshCcw } from 'lucide-react';
import axios from 'axios';

import { usePage } from '@inertiajs/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const schema = z.object({
  reference_number: z.string().min(1, 'Reference number is required').max(30, 'Reference number must be at most 30 characters'),
  previous_reference_number: z.string().max(30, 'Previous reference number must be at most 30 characters').nullable().optional(),

  project_id: z.number('Project is required').int().positive(),

  coordinator_id: z.number().int().positive().nullable().optional(),

  // Delegate to operation (coordinating) office
  operation_org_id: z.number().int().positive().nullable(),
  operation_coordinator_id: z.number().int().positive().nullable().optional(),

  delegates: z
    .array(
      z.object({
        org_id: z.number().int().positive(),
        name: z.string().optional(),
      }),
    )
    .optional(),

  skill_id: z.number().int().positive().nullable().optional(),

  vendor_id: z.number().int().positive().nullable(),
  purchase_order_id: z.number().int().positive().nullable(),
  sub_vendor_id: z.number().int().positive().nullable(),

  client_po: z.string().max(30).nullable().optional(),
  client_po_rev: z.string().max(10).nullable().optional(),
  po_delivery_date: z.string().nullable().optional(),
  close_date: z.string().nullable().optional(),
  final_invoice_date: z.string().nullable().optional(),

  i_e_a: z.string().nullable().optional(),

  attachments: z.array(
    z.file()
  ).nullable().optional(),

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
  send_report_to: z.string().nullable().optional(),
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

export function AssignmentForm(props: DialogFormProps<Assignment>) {
  const {
    props: {
      auth
    }
  } = usePage<SharedData>();

  const isEdit = !!props.value;

  const [type, setType] = useState(props.value?.operation_org_id ? 'delegate' : 'direct'); // 0 = direct assignment, 1 = delegated

  const form = useReactiveForm<z.infer<typeof schema>, Assignment>({
    ...useResource('/api/v1/assignments', {
      operation_org_id: null,
      inspectors: [],
      sub_vendor_id: null,
      vendor_id: null,
      notes: '',
      report_required: false,
      ...props.value
    }),
    resolver: zodResolver(schema),
  });

  const i_am_the_operation_office = props.value?.operation_org_id === auth.org?.id

  useEffect(() => {
    if (props.value) {
      form.reset(props.value as any);
    }
  }, [props.value]);

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
        <DialogContent className={'sm:max-w-2xl'}>
          <DialogHeader>
            <DialogTitle>Assignment</DialogTitle>
            <DialogDescription>Fill in the necessary details and submit.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-8'}>
                <div className={'col-span-12 mt-8 text-lg font-bold'}>Basic Information</div>

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
                      <VFormField required label={'Project'} className={'col-span-4'}>
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
                      <VFormField required label={'Purchase Order'} className={'col-span-4'}>
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
                      <VFormField required label={'Coordinator'} className={'col-span-4'}>
                        <StaffSelect
                          onValueChane={field.onChange}
                          value={field.value || null}
                        />
                      </VFormField>
                    </>
                  )}
                />

                {i_am_the_operation_office ? null : (
                  <div className={'col-span-12 p-4 border rounded-lg bg-background ring-4 ring-accent'}>
                    <RadioGroup defaultValue={type} disabled={isEdit} onValueChange={setType} className={'col-span-12'}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="direct" id="r1" />
                        <Label htmlFor="r1">Directly to inspector</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="delegate" id="r2" />
                        <Label htmlFor="r2">Delegate to operation office</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {type === 'delegate' ? (
                  <div className={'col-span-12 grid grid-cols-6 gap-4'}>
                    <FormField
                      name={'operation_org_id'}
                      control={form.control}
                      render={({ field }) => (
                        <>
                          <VFormField label={'Operation Office'} className={'col-span-6'}>
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

                    <FormField
                      name={'operation_coordinator_id'}
                      control={form.control}
                      render={({ field }) => (
                        <>
                          <VFormField label={'Operation Office Coordinator'} className={'col-span-6'}>
                            <StaffSelect
                              params={{ org: form.watch('operation_org_id') }}
                              onValueChane={field.onChange}
                              value={field.value ?? null}
                            />
                          </VFormField>
                        </>
                      )}
                    />
                  </div>
                ) : null}

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Client / Vendor / Equipment</div>

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

                <div className={'col-span-4'}>
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

                <div className={'col-span-4'}>
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

                <div className={'col-span-4'}>
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

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <VFormField label={'I/E/A'}>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger className={'bg-background w-full'}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="I">I</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="IE">IE</SelectItem>
                            <SelectItem value="EA">EA</SelectItem>
                            <SelectItem value="IA">IA</SelectItem>
                            <SelectItem value="IEA">IEA</SelectItem>
                          </SelectContent>
                        </Select>
                      </VFormField>
                    )}
                    name={'i_e_a'}
                  />
                </div>

                {/*<div className={'col-span-12'}>*/}
                {/*  <RadioGroup defaultValue={mode} onValueChange={setMode} orientation={'horizontal'}>*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*      <RadioGroupItem value="assign" id="r1" />*/}
                {/*      <Label htmlFor="r1">Assign to inspector</Label>*/}
                {/*    </div>*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*      <RadioGroupItem value="delegate" id="r2" />*/}
                {/*      <Label htmlFor="r2">Delegate</Label>*/}
                {/*    </div>*/}
                {/*  </RadioGroup>*/}
                {/*</div>*/}
                {/*{*/}
                {/*  mode === 'delegate' ? (*/}
                {/*    <FormField*/}
                {/*      name={'operation_org_id'}*/}
                {/*      control={form.control}*/}
                {/*      render={({ field }) => (*/}
                {/*        <>*/}
                {/*          <VFormField*/}
                {/*            label={'Operation Office'}*/}
                {/*            className={'col-span-12'}*/}
                {/*            description={'Operation office will decide who will be the coordinator and inspector.'}*/}
                {/*          >*/}
                {/*            <OrgSelect placeholder={'Choose an operation office'} onValueChane={field.onChange} value={field.value} />*/}
                {/*          </VFormField>*/}
                {/*        </>*/}
                {/*      )}*/}
                {/*    />*/}
                {/*  ) : (*/}
                {/*    <div className={'col-span-12 grid grid-cols-1 gap-4'}>*/}
                {/*      <FormField*/}
                {/*        control={form.control}*/}
                {/*        render={({ field }) => {*/}
                {/*          return (*/}
                {/*            <div className={'w-full'}>*/}
                {/*              <AllInspectors*/}
                {/*                value={field.value}*/}
                {/*                onRemove={(value) => {*/}
                {/*                  field.onChange((field.value ?? []).filter((item) => item != value));*/}
                {/*                }}*/}
                {/*              />*/}
                {/*              <AddInspectorForm*/}
                {/*                onValueChange={(value) => {*/}
                {/*                  field.onChange([...field.value, value]);*/}
                {/*                }}*/}
                {/*              >*/}
                {/*                <Button className={'w-full'}>*/}
                {/*                  <PlusIcon /> Add Inspector*/}
                {/*                </Button>*/}
                {/*              </AddInspectorForm>*/}
                {/*              <FormMessage />*/}
                {/*            </div>*/}
                {/*          );*/}
                {/*        }}*/}
                {/*        name={'inspectors'}*/}
                {/*      />*/}
                {/*    </div>*/}
                {/*  )*/}
                {/*}*/}

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

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Instructions</div>

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

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Visit Details</div>

                <div className={'col-span-12 grid grid-cols-12 gap-4'}>
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
                        description={"Contact person at the client's side for visit coordination, set up in the client contacts if needed."}
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
                    name={'visit_contact_id'}
                  />
                </div>

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Scope of Assignment</div>

                <div className={'col-span-12'}>
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
                </div>

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Status / Flash Report / Exit Call</div>

                <div className={'col-span-12'}>
                  <div className={'grid grid-cols-12 gap-4'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <VFormField label={'Contact Name'} className={'col-span-12'}>
                          <Input value={field.value || ''} onChange={field.onChange} />
                        </VFormField>
                      )}
                      name={'contact_details'}
                    />
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <VFormField label={'Contact Email'} className={'col-span-12'}>
                          <Input type="email" value={field.value || ''} onChange={field.onChange} />
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
                </div>

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Reporting</div>

                <div className={'col-span-12'}>
                  <div className={'grid grid-cols-12 gap-4'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <VFormField label={'Reporting Format'} className={'col-span-6'}>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                      name={'send_report_to'}
                    />
                    <FormField
                      control={form.control}
                      render={({ field }) => (
                        <VFormField label={'Timesheet Format'} className={'col-span-6'}>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString() || '0'}>
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
                  </div>
                </div>

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Attachments</div>

                <div className={'col-span-12'}>
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
                </div>

                <div className={'col-span-12 mt-8 text-lg font-bold'}>Notes</div>

                <div className={'col-span-12'}>
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
                </div>

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => (
                      <VFormField label={'Special Notes'}>
                        <div className={'bg-background overflow-hidden rounded-md border'}>
                          <Editor value={field.value ?? ''} onChange={field.onChange} />
                        </div>
                      </VFormField>
                    )}
                    name={'special_notes'}
                  />
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

interface ReferenceNumberProps {
  value: string,
  onValueChange: (value: string) => void
  allowGenerate?: boolean
}

function ReferenceNumber({value, onValueChange, ...props}: ReferenceNumberProps) {
  const generate = useCallback(() => {
    axios.get('/api/v1/assignments/next-assignment-number').then(response => {
      if (response.data) {
        onValueChange(response.data.data);
      }
    })
  }, [onValueChange]);

  useEffect(() => {
    console.info('use effect', value);
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
        <RefreshCcw/>
      </Button>
    </div>
  );
}
