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
import zod from 'zod';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { ProjectSelect } from '@/components/project-select';
import { VendorSelect } from '@/components/vendor-select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { StaffSelect } from '@/components/user-select';
import { OrgSelect } from '@/components/org-select';

const schema = zod.object({
  'project_id': zod.number().int().positive(),
  'operation_org_id': zod.number().int().positive().nullable(),
  'assignment_type_id': zod.number().int().positive(),
  'inspector_id': zod.number().int().positive().nullable(),
  'vendor_id': zod.number().int().positive().nullable(),
  'sub_vendor_id': zod.number().int().positive().nullable(),
  'report_required': zod.boolean(),
  'notes': zod.string().max(1500).nullable(),
});

export function AssignmentForm(props: DialogFormProps<Assignment>) {
  const form = useReactiveForm<zod.infer<typeof schema>>({
    defaultValues: {
      operation_org_id: null,
      sub_vendor_id: null,
      vendor_id: null,
      notes: '',
      report_required: false,
      inspector_id: null,
    },
    url: '/api/v1/assignments',
    resolver: zodResolver(schema),
  });

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        props.onSubmit(await response.json())
      }
    })
  }

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create or update Assignment</DialogTitle>
            <DialogDescription>Use this form to create or update an assignment. Fill in the necessary details and submit.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-4'}>
                <FormField
                  name={'project_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        required
                        error={fieldState.error?.message}
                        for={'project_id'}
                        label={'Project'}
                        className={'col-span-12'}>
                        <ProjectSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'inspector_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        required
                        error={fieldState.error?.message}
                        for={'inspector_id'}
                        label={'Inspector'}
                        className={'col-span-12'}>
                        <StaffSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'operation_org_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        error={fieldState.error?.message}
                        for={'operation_org_id'}
                        label={'Operation Organization'}
                        className={'col-span-12'}>
                        <OrgSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'vendor_id'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        error={fieldState.error?.message}
                        for={'vendor_id'}
                        label={'Vendor'}
                        className={'col-span-6'}>
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
                      <VFormField
                        error={fieldState.error?.message}
                        for={'sub_vendor_id'}
                        label={'Sub Vendor'}
                        className={'col-span-6'}>
                        <VendorSelect onValueChane={field.onChange} value={field.value} />
                      </VFormField>
                    </>
                  )}
                />
                <FormField
                  name={'report_required'}
                  control={form.control}
                  render={({ field }) => (
                    <div className={'col-span-12'}>
                      <Label>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        Report is required
                      </Label>
                    </div>
                  )}
                />
                <FormField
                  name={'notes'}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <VFormField
                        error={fieldState.error?.message}
                        for={'notes'}
                        label={'Notes'}
                        className={'col-span-12'}>
                        <Textarea className={'bg-background'} value={field.value ?? ''} onChange={field.onChange} />
                      </VFormField>
                    </>
                  )}
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
            <Button disabled={form.formState.disabled || form.formState.isSubmitting} onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
