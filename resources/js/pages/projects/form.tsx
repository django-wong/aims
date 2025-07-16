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
import { PropsWithChildren, useState } from 'react';
import { Project } from '@/types';

// THIS COMPONENT DEMONSTRATED DIFFERENT WAYS TO USE THE FORM COMPONENT

interface ProjectFormProps {
  trigger: React.ReactNode;
  onSuccess: () => void;
}

export function ProjectForm(props: PropsWithChildren<ProjectFormProps>) {
  const [open, setOpen] = useState(false);

  const form = useReactiveForm<Project>({
    defaultValues: {
      title: '',
      code: '',
      quote_id: null,
    },
    url: 'api/v1/projects',
    method: 'POST',
  });

  function submit() {
    form.submit().then((response) => {
      if (response) {
        if (response.ok) {
          props.onSuccess();
          setOpen(false);
        }
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{props.trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the details below to create a new project.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent className={'max-h-[50vh] overflow-y-auto'}>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-4'}>
                <FormField
                  render={({field, fieldState}) => (
                    <VFormField label={'Title'} for={'title'} error={fieldState.error?.message} className={'col-span-12'}>
                      <Input
                        placeholder={'Give your project a title'}
                        className={'bg-white col-span-12'}
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
                  render={({field, fieldState}) => (
                    <VFormField label={'Code'} for={'code'} error={fieldState.error?.message} className={'col-span-4'}>
                      <Input
                        className={'bg-white col-span-12'}
                        placeholder={'e.g. PRJ-1234'}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </VFormField>
                  )}
                  name={'code'}
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
