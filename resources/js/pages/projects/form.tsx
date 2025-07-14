import { ClientSelect } from '@/components/client-select';
import { DialogInnerContent } from '@/components/dialog-inner-content';
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
import { Form, FormControl, FormDescription, FormField, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Job } from '@/types';
import { Loader2Icon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Controller } from 'react-hook-form';

// THIS COMPONENT DEMONSTRATED DIFFERENT WAYS TO USE THE FORM COMPONENT

interface ProjectFormProps {
  trigger: React.ReactNode;
  onSuccess: () => void;
}

export function ProjectForm(props: PropsWithChildren<ProjectFormProps>) {
  const [open, setOpen] = useState(false);

  const form = useReactiveForm<
    Job & {
      requireClientSignature: boolean;
    }
  >({
    defaultValues: {
      title: 'Clean up the roof',
      job_type_id: null,
      description: `There was lots of debris on the roof after the storm. I need someone to clean it up and make sure there are no loose tiles or other hazards. The job should take about 2 hours and can be done any time this week.`,
      client_id: null,
      contractor_id: null,
      requireClientSignature: false,
    },
    url: 'api/v1/jobs',
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
        <DialogContent className={'max-w-lg'}>
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>Fill in the details below to create a new job.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent className={'max-h-[50vh] overflow-y-auto'}>
            <Form {...form}>
              <div className={'grid grid-cols-12 gap-4'}>
                {/* You can pass on the register */}
                <Title {...form.register('title')} error={form.formState.errors.title?.message} />

                {/* Or if your form field holds the state internally, you can use the get, set methods */}
                <FormField
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Type
                        error={fieldState.error?.message}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </>
                  )}
                  name={'job_type_id'}
                />

                {/* Wrap your custom components with FormField to integrate with react-hook-form */}
                <FormField
                  render={({ field }) => (
                    <Description
                      error={form.formState.errors.description?.message}
                      value={field.value ?? ''}
                      onValueChange={(value) => field.onChange(value)}
                    />
                  )}
                  name={'description'}
                  control={form.control}
                />

                {/* Or use Controller from react-hook-form */}
                <Controller
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className={'col-span-6'}>
                      <Client
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      <FormDescription className={'text-red-500'}>{fieldState.error?.message}</FormDescription>
                    </div>
                  )}
                  name={'client_id'}
                />

                {/* If you don't want to use FormField */}
                <Contractor
                  error={form.formState.errors.contractor_id?.message}
                  value={form.getValues('contractor_id')}
                  onValueChange={(value) => {
                    form.setValue('contractor_id', value);
                  }}
                />

                <FormField
                  control={form.control}
                  name={'requireClientSignature'}
                  render={({ field }) => (
                    <>
                      <FormControl className={'col-span-12'}>
                        <div className={'flex items-start gap-2'}>
                          <Checkbox
                            className={'bg-white'}
                            id={'requireSignature'}
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(!!checked)}
                          />
                          <div className={'flex flex-col space-y-1 leading-none'}>
                            <FormLabel htmlFor={'requireSignature'}>Client signature is required</FormLabel>
                            <FormDescription>Job cannot be marked as complete until the client signs off on the work.</FormDescription>
                          </div>
                        </div>
                      </FormControl>
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

function Title(
  props: React.ComponentProps<'input'> & {
    error?: string | null;
  },
) {
  return (
    <div className={'col-span-8'}>
      <VFormField label={'Title'} for={'title'} error={props.error}>
        <Input className={'bg-white'} {...props} />
      </VFormField>
    </div>
  );
}

function Client(props: { value: number | null; onValueChange: (value: number) => void }) {
  return (
    <VFormField label={'Client'} for={'client'}>
      <ClientSelect
        canCreateNew={true}
        className={'bg-white'}
        value={props.value}
        onValueChane={(value) => props.onValueChange(value)}
        createButton={<>Are you ok?</>}
      />
    </VFormField>
  );
}

function Contractor(props: { value: number | null; onValueChange: (value: number) => void; error?: string | null }) {
  return (
    <div className={'col-span-6'}>
      <VFormField label={'Contractor'} for={'contractor'} error={props.error}>
        <Input
          className={'bg-white'}
          value={props.value ? String(props.value) : ''}
          onChange={() => {
            props.onValueChange(0);
          }}
          placeholder={'Choose a contractor'}
        />
      </VFormField>
    </div>
  );
}

function Description(props: { value: string; onValueChange: (value: string) => void; error?: string | null }) {
  return (
    <div className={'col-span-12'}>
      <VFormField label={'Description'} for={'description'} error={props.error}>
        <Textarea
          className={'bg-white'}
          value={props.value}
          onChange={(event) => {
            props.onValueChange(event.target.value);
          }}
        />
      </VFormField>
    </div>
  );
}

function Type(props: { value: number | null; onValueChange?: (value: number | null) => void; error?: string | null }) {
  const [value, setValue] = useState(props.value);
  const types = [
    { id: 1, name: 'Plumbing' },
    { id: 2, name: 'Electrical' },
    { id: 3, name: 'Carpentry' },
    { id: 4, name: 'Painting' },
    { id: 5, name: 'Roofing' },
    { id: 6, name: 'Landscaping' },
    { id: 7, name: 'Tiling' },
    { id: 8, name: 'Fencing' },
    { id: 9, name: 'Concreting' },
    { id: 10, name: 'Demolition' },
    { id: 11, name: 'Maintenance' },
    { id: 12, name: 'Other' },
  ];
  return (
    <div className={'col-span-4'}>
      <VFormField label={'Type'} for={'type'} error={props.error}>
        <Select
          onValueChange={(value) => {
            const val = value ? parseInt(value) : null;
            setValue(val);
            props.onValueChange?.(val);
          }}
          value={value ? String(value) : ''}
        >
          <SelectTrigger className={'w-full bg-white'}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Job Types</SelectLabel>
              {types.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </VFormField>
    </div>
  );
}
