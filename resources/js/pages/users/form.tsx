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
import { DialogFormProps, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import zod from 'zod';
import { RoleSelect } from '@/components/role-select';

type UserFormProps = DialogFormProps<User>;

const updateSchema = zod.object({
  id: zod.number(),
  password: zod.string().min(6).optional(),
  password_confirmation: zod.string().optional(),
});

const createSchema = zod.object({
  id: zod.null(),
  role: zod.number(),
  password: zod.string().min(6),
  password_confirmation: zod.string(),
});

const schema = zod.union([
  zod.object({
    first_name: zod.string('').min(1),
    last_name: zod.string().min(1),
    title: zod.string().optional().nullable(),
    email: zod.email(),
  }),
  zod.discriminatedUnion('id', [
    createSchema,
    updateSchema,
  ])
])

export function UserForm(props: UserFormProps) {
  const form = useReactiveForm<zod.infer<typeof schema>, any>({
    ...useResource('/api/v1/users', {
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      password: '',
      password_confirmation: '',
      ...props.value,
      role: props.value?.user_role?.role
    }),
    resolver: zodResolver(schema),
  });

  const isUpdate = !!(props.value && props.value.id);

  function save() {
    console.info(form.getValues());
    form.submit().then(async (response) => {
      if (response) {
        console.info('User saved successfully', response);
        props.onSubmit(response.data);
      }
    });
  }

  return (
    <>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        {props.children && <DialogTrigger asChild={props.asChild === undefined ? true : props.asChild}>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User</DialogTitle>
            <DialogDescription>Fill in the details below to create or update the user.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <form>
              <div className={'grid grid-cols-12 gap-4'}>
                <Form {...form}>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField for={'title'} label={'Title'}>
                            <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'Mr, Ms, Dr, etc.'} />
                          </VFormField>
                        );
                      }}
                      name={'title'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      render={({ field, fieldState }) => {
                        return (
                          <VFormField required label={'First Name'} for={'first_name'} error={fieldState.error?.message}>
                            <Input value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'first_name'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <VFormField required label={'Last Name'} for={'last_name'} error={fieldState.error?.message}>
                            <Input value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'last_name'}
                    />
                  </div>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <VFormField required label={'Email'} for={'email'} error={fieldState.error?.message}>
                            <Input placeholder={'example@mail.com'} type={'email'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'email'}
                    />
                  </div>
                  {isUpdate ? null : (
                    <div className={'col-span-12'}>
                      <FormField
                        control={form.control}
                        render={({field, fieldState}) => {
                          return (
                            <VFormField required label={'Role'} for={'role'} error={fieldState.error?.message}>
                              <RoleSelect onValueChane={field.onChange} value={field.value}/>
                            </VFormField>
                          )
                        }}
                        name={'role'}
                      />
                    </div>
                  )}
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <VFormField required={!isUpdate} label={'Password'} for={'password'} error={fieldState.error?.message}>
                            <Input placeholder={isUpdate ? 'Leave blank to retain existing password' : ''} type={'password'} value={field.value} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'password'}
                    />
                  </div>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <VFormField required={!isUpdate} label={'Confirm Password'} error={fieldState.error?.message}>
                            <Input type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'password_confirmation'}
                    />
                  </div>
                </Form>
              </div>
            </form>
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={form.submitDisabled} onClick={save}>
              {form.formState.isSubmitting ? <Circle className={'animate-spin'} /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
