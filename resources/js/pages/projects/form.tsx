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
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { Loader2Icon } from 'lucide-react';
import { DialogFormProps, Project } from '@/types';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { ClientSelect } from '@/components/client-select';
import { ProjectTypeSelect } from '@/components/project-type-select';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  project_type_id: z.number(),
  client_id: z.number(),
  commission_rate: z.coerce.number().min(0),
  process_fee_rate: z.coerce.number().min(0),
  tax_rate: z.coerce.number().min(0).optional().nullable(),
});

export function ProjectForm(props: DialogFormProps<Project>) {
  const form = useReactiveForm<z.infer<typeof schema>, Project>({
    ...(useResource('/api/v1/projects', {
      title: '',
      project_type_id: null,
      client_id: null,
      commission_rate: 7.5,
      process_fee_rate: 5.0,
      ...props.value
    })),
    resolver: zodResolver(schema) as any,
  });

  const [open, setOpen] = useState(props.open);

  function submit() {
    form.submit().then((response) => {
      if (response) {
        props.onSubmit?.(response.data);
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
                    return <VFormField required label={'Client'} className={'col-span-12 sm:col-span-6'}>
                      <ClientSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'client_id'}
                />
                <FormField
                  control={form.control}
                  render={({field}) => {
                    return <VFormField
                      required
                      description={'Apply to all delegated assignments of the project'}
                      label={'Commission %'} className={'col-span-12 sm:col-span-4'}>
                      <Input type={'number'} onChange={field.onChange} value={field.value ?? ''}/>
                    </VFormField>;
                  }}
                  name={'commission_rate'}
                />
                <FormField
                  control={form.control}
                  render={({field}) => {
                    return <VFormField
                      required
                      description={'Apply to each expenses'}
                      label={'Process fee %'} className={'col-span-12 sm:col-span-4'}>
                      <Input type={'number'} onChange={field.onChange} value={field.value ?? ''}/>
                    </VFormField>;
                  }}
                  name={'process_fee_rate'}
                />
                <FormField
                  control={form.control}
                  render={({field}) => {
                    return <VFormField
                      label={'Tax Rate'} className={'col-span-12 sm:col-span-4'}>
                      <Input type={'number'} onChange={field.onChange} value={field.value ?? ''}/>
                    </VFormField>;
                  }}
                  name={'tax_rate'}
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
