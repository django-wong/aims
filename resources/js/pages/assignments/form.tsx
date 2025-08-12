import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Assignment, DialogFormProps, SharedData } from '@/types';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import zod from 'zod';
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
import { usePage } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const schema = zod.object({
  'project_id': zod.number('Project is required').int().positive(),
  'assignment_type_id': zod.number().int().positive(),

  'operation_org_id': zod.number().int().positive().nullable(),
  'inspector_id': zod.number().int().positive().nullable(),

  'vendor_id': zod.number().int().positive().nullable(),
  'purchase_order_id': zod.number().int().positive().nullable(),
  'sub_vendor_id': zod.number().int().positive().nullable(),
  'report_required': zod.boolean(),
  'notes': zod.string().max(1500).nullable(),
});

export function AssignmentForm(props: DialogFormProps<Assignment>) {
  const form = useReactiveForm<zod.infer<typeof schema>>({
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

  const {
    props: {
      auth: {
        org
      }
    }
  } = usePage<SharedData>();

  useEffect(() => {
    if (props.value) {
      form.reset(props.value);
    }
  }, [props.value]);

  const isEdit = !!props.value;

  const [mode, setMode] = useState(props.value?.operation_org_id === org?.id ? 'assign' : 'delegate');

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        props.onSubmit(await response.json());
        props.onOpenChange?.(false);
      }
    })
  }

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment</DialogTitle>
            <DialogDescription>Fill in the necessary details and submit.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-4'}>
                <FormField
                  name={'project_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField required error={fieldState.error?.message} for={'project_id'} label={'Project'} className={'col-span-12'}>
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
                        <PurchaseOrderSelect value={field.value} onValueChane={field.onChange}/>
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'assignment_type_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        required
                        error={fieldState.error?.message}
                        for={'assignment_type_id'}
                        label={'Assignment Type'}
                        className={'col-span-12'}
                      >
                        <AssignmentTypeSelect value={field.value} onValueChane={field.onChange} />
                      </VFormField>
                    </>
                  )}
                />
                <div className={'col-span-12'}>
                  <Tabs value={mode} onValueChange={setMode}>
                    <TabsList>
                      <TabsTrigger value={'assign'}>Assign to inspector</TabsTrigger>
                      <TabsTrigger value={'delegate'}>Delegate to other office</TabsTrigger>
                    </TabsList>
                    <TabsContent value={'assign'}>
                      <FormField
                        name={'inspector_id'}
                        control={form.control}
                        render={({ field }) => (
                          <>
                            <VFormField
                              className={'col-span-12'}>
                              <StaffSelect onValueChane={field.onChange} value={field.value} />
                            </VFormField>
                          </>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value={'delegate'}>
                      <FormField
                        name={'operation_org_id'}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <>
                            <VFormField
                              error={fieldState.error?.message}
                              for={'operation_org_id'}
                              className={'col-span-12'}>
                              <OrgSelect onValueChane={field.onChange} value={field.value} />
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
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField error={fieldState.error?.message} for={'vendor_id'} label={'Vendor'} className={'col-span-6'}>
                        <VendorSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'sub_vendor_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField error={fieldState.error?.message} for={'sub_vendor_id'} label={'Sub Vendor'} className={'col-span-6'}>
                        <VendorSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'notes'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField error={fieldState.error?.message} for={'notes'} label={'Notes'} className={'col-span-12'}>
                        <Textarea
                          className={'bg-background min-h-36'}
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          placeholder={'Describe any notes or additional information about the assignment.'}
                        />
                      </VFormField>
                    </>
                  )}
                />
              </div>
            </Form>
          </DialogInnerContent>
          <DialogFooter className={'flex-row items-center'}>
            {/*<FormField*/}
            {/*  name={'report_required'}*/}
            {/*  control={form.control}*/}
            {/*  render={({ field }) => (*/}
            {/*    <div className={'col-span-12'}>*/}
            {/*      <Label>*/}
            {/*        <Switch checked={field.value} onCheckedChange={field.onChange} />*/}
            {/*        Report is required*/}
            {/*      </Label>*/}
            {/*    </div>*/}
            {/*  )}*/}
            {/*/>*/}
            {/*<span className={'flex-grow'}></span>*/}
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
