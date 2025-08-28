import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
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
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Loader2Icon } from 'lucide-react';
import { DialogFormProps, Project } from '@/types';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { ClientSelect } from '@/components/client-select';
import { ProjectTypeSelect } from '@/components/project-type-select';

function number() {
  return zod.coerce.number().min(0);
}

const schema = zod.object({
  title: zod.string().min(1, 'Title is required'),
  po_number: zod.string().min(1, 'PO Number is required').default(''),
  number: zod.string().min(1),
  project_type_id: zod.number().nullable(),
  client_id: zod.number().nullable(),
  budget: zod.number().min(0, 'Budget must be a positive number'),
  quote_id: zod.number().nullable().optional(),
  status: zod.number().default(1),

  first_alert_threshold: number(),
  second_alert_threshold: number(),
  final_alert_threshold: number(),
});

export function ProjectForm(props: DialogFormProps<Project>) {
  const form = useReactiveForm<zod.infer<typeof schema>, Project>({
    url: 'api/v1/projects',
    method: 'POST',
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: 'My awesome new project',
      po_number: 'PO-1174',
      project_type_id: 2,
      client_id: null,
      budget: 50_000,
      status: Math.random() > 0.5 ? 1 : 0,
      first_alert_threshold: 70,
      second_alert_threshold: 90,
      final_alert_threshold: 100,
    }
  });

  const [open, setOpen] = useState(props.open);

  function submit() {
    form.submit().then((response) => {
      if (response) {
        props.onSubmit(response.data);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          props.onOpenChange?.(value);
        }}>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent className={'sm:max-w-xl'}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the details below to create a new project.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent className={'max-h-[50vh] overflow-y-auto'}>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-6'}>
                <FormField
                  control={form.control}
                  render={({field}) => (
                    <VFormField required label={'Title'} className={'col-span-12'}>
                      <Input
                        placeholder={'Give your project a title'}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </VFormField>
                  )}
                  name={'title'}
                />
                <FormField
                  control={form.control}
                  render={({field}) => {
                    return <VFormField required label={'Project Type'} className={'col-span-12 sm:col-span-6'}>
                      <ProjectTypeSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'project_type_id'}
                />
                <FormField
                  control={form.control}
                  render={({field}) => {
                    return <VFormField label={'Client'} className={'col-span-12 sm:col-span-6'}>
                      <ClientSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'client_id'}
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
            <Button disabled={form.formState.isSubmitting || form.formState.disabled} onClick={submit}>
              {form.formState.isSubmitting && <Loader2Icon className={'animate-spin'} />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
