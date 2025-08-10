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
import { Form, FormControl, FormField } from '@/components/ui/form';
import { Input, Inputs } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Loader2Icon, RefreshCcw } from 'lucide-react';
import { DialogFormProps, Project } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { ClientSelect } from '@/components/client-select';
import { ProjectTypeSelect } from '@/components/project-type-select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import axios from 'axios';

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
              <div className={'grid grid-cols-12 gap-4'}>
                <FormField
                  control={form.control}
                  render={({field, fieldState}) => (
                    <VFormField required label={'Title'} for={'title'} error={fieldState.error?.message} className={'col-span-12'}>
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
                  render={({field, fieldState}) => (
                    <VFormField required label={'PO'} for={'po_number'} error={fieldState.error?.message} className={'col-span-12 sm:col-span-6'}>
                      <Input
                        placeholder={'e.g. PO-1234'}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                        }}
                      />
                    </VFormField>
                  )}
                  name={'po_number'}
                />
                <FormField
                  control={form.control}
                  render={({field, fieldState}) => (
                    <VFormField required label={'Project Number'} for={'project_number'} error={fieldState.error?.message} className={'col-span-12 sm:col-span-6'}>
                      <ProjectNumber value={field.value} onValueChange={field.onChange} allowGenerate={!!(props.value?.id || true)}/>
                    </VFormField>
                  )}
                  name={'number'}
                />
                <FormField
                  control={form.control}
                  render={({field, fieldState}) => {
                    return <VFormField required label={'Project Type'} for={'project_type_id'} error={fieldState.error?.message} className={'col-span-12 sm:col-span-6'}>
                      <ProjectTypeSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'project_type_id'}
                />
                <FormField
                  control={form.control}
                  render={({field, fieldState}) => {
                    return <VFormField label={'Client'} for={'client_id'} error={fieldState.error?.message} className={'col-span-12 sm:col-span-6'}>
                      <ClientSelect onValueChane={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'client_id'}
                />
                <FormField
                  control={form.control}
                  render={({field, fieldState}) => {
                    return <VFormField label={'Budget $'} for={'budget'} error={fieldState.error?.message} className={'col-span-12 sm:col-span-6'}>
                      <Input placeholder={'e.g. 10000'} type={'number'} min={0} max={9999999999} onChange={field.onChange} value={field.value}/>
                    </VFormField>;
                  }}
                  name={'budget'}
                />
                <div className={'col-span-12 sm:col-span-6 grid gap-2'}>
                  <Label>Alert Threshold (%)</Label>
                  <Inputs>
                    <FormField
                      control={form.control}
                      render={({field}) => (
                        <FormControl>
                          <Input
                            placeholder={'70'}
                            type={'number'}
                            className={'bg-background'}
                            value={field.value || ''}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                      )}
                      name={'first_alert_threshold'}
                    />
                    <FormField
                      control={form.control}
                      render={({field}) => (
                        <FormControl>
                        <Input
                          placeholder={'90'}
                          type={'number'}
                          className={'bg-background'}
                          value={field.value || ''}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                        </FormControl>
                      )}
                      name={'second_alert_threshold'}
                    />
                    <FormField
                      control={form.control}
                      render={({field}) => (
                        <FormControl>
                        <Input
                          placeholder={'100'}
                          type={'number'}
                          className={'bg-background'}
                          value={field.value || ''}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                        </FormControl>
                      )}
                      name={'final_alert_threshold'}
                    />
                  </Inputs>
                </div>
                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({field}) => {
                      return <>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.value === 0}
                            disabled={!!(props.value?.status && props.value.status > 0)}
                            onCheckedChange={(checked) => {
                              if (! props.value?.status) {
                                field.onChange(checked ? 0 : 1)
                              }
                            }}
                          />
                          <Label>Save as Draft (hide from to client)</Label>
                        </div>
                      </>;
                    }}
                    name={'status'}
                  />
                </div>
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


interface ProjectNumberProps {
  value: string,
  onValueChange: (value: string) => void
  allowGenerate?: boolean
}
function ProjectNumber({value, onValueChange, ...props}: ProjectNumberProps) {
  const generate = useCallback(() => {
    axios.get('/api/v1/projects/next-project-number').then(response => {
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
