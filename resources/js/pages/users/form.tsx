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
  method: zod.literal('update'),
  password: zod.string().min(6).optional().nullable(),
  password_confirmation: zod.string().optional().nullable(),
  first_name: zod.string('').min(1),
  last_name: zod.string().min(1),
  title: zod.string().optional().nullable(),
  email: zod.email(),
});

const createSchema = zod.object({
  method: zod.literal('create'),
  role: zod.number(),
  password: zod.string().min(6),
  password_confirmation: zod.string(),
  first_name: zod.string('').min(1),
  last_name: zod.string().min(1),
  title: zod.string().optional().nullable(),
  email: zod.email(),
});

const schema = zod.discriminatedUnion('method', [
  createSchema,
  updateSchema,
]);

export function UserForm(props: UserFormProps) {
  const form = useReactiveForm<zod.infer<typeof schema>, any>({
    ...useResource('/api/v1/users', {
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      password: null,
      password_confirmation: null,
      ...props.value,
      role: props.value?.user_role?.role,
      method: (props.value && props.value.id) ? 'update' : 'create' as any,
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
              <div className={'grid grid-cols-12 gap-6'}>
                <Form {...form}>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField label={'Title'}>
                            <Input value={field.value ?? ''} onChange={field.onChange} placeholder={'Mr, Ms, Dr, etc.'} />
                          </VFormField>
                        );
                      }}
                      name={'title'}
                    />
                  </div>
                  <div className={'col-span-6'}>
                    <FormField
                      render={({ field }) => {
                        return (
                          <VFormField required label={'First Name'}>
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
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Last Name'}>
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
                      render={({ field }) => {
                        return (
                          <VFormField required label={'Email'}>
                            <Input autoComplete={'email'} placeholder={'example@mail.com'} type={'email'} value={field.value} onChange={field.onChange} />
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
                        render={({field}) => {
                          return (
                            <VFormField required label={'Role'}>
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
                      render={({ field }) => {
                        return (
                          <VFormField required={!isUpdate} label={'Password'}>
                            <Input autoComplete={'new-password'} placeholder={isUpdate ? 'Leave blank to retain existing password' : ''} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                          </VFormField>
                        );
                      }}
                      name={'password'}
                    />
                  </div>
                  <div className={'col-span-12'}>
                    <FormField
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <VFormField required={!isUpdate} label={'Confirm Password'}>
                            <Input autoComplete={'new-password'} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
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
