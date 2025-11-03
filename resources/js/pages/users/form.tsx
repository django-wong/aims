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
import { DialogFormProps, User, UserRoleEnum } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle } from 'lucide-react';
import zod from 'zod';
import { RoleSelect } from '@/components/role-select';
import { useEffect, useState } from 'react';

type UserFormProps = DialogFormProps<User> & {
  role?: UserRoleEnum
};

const schema = zod.object({
  id: zod.coerce.number().optional().nullable(),
  title: zod.string().optional().nullable(),
  first_name: zod.string('').min(1),
  last_name: zod.string().min(1),
  email: zod.email(),
  role: zod.coerce.number().optional().nullable(),
  password: zod.string().min(6).optional().nullable(),
  password_confirmation: zod.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (! data.id) {
    // password is required
    if (! data.password) {
      ctx.addIssue({
        path: ['password'],
        code: 'custom',
        message: 'Password is required when creating new user',
      });
    }
    // role is required
    if (! data.role) {
      ctx.addIssue({
        path: ['role'],
        code: 'custom',
        message: 'Role is required',
      });
    }
  }
});

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
      role: props.role || props.value?.user_role?.role,
    }),
    resolver: zodResolver(schema) as any,
  });

  const isUpdate = !!(props.value && props.value.id);

  function save() {
    form.submit().then(async (response) => {
      if (response) {
        props.onSubmit?.(response.data);
        setOpen(false);
        if (props.onOpenChange) {
          props.onOpenChange(open);
        }
      }
    });
  }

  useEffect(() => {
    if (props.value) {
      form.reset(props.value)
    }
  }, [props.value])

  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        setOpen(open);
        if (props.onOpenChange) {
          props.onOpenChange(open);
        }
      }}>
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
                  {
                    isUpdate ? null : (
                      <div className={'col-span-12'}>
                        <FormField
                          control={form.control}
                          render={({field}) => {
                            return (
                              <VFormField required label={'Role'}>
                                <RoleSelect
                                  disabled={!!(isUpdate || props.role)}
                                  onValueChane={field.onChange}
                                  value={field.value ?? null}
                                />
                              </VFormField>
                            )
                          }}
                          name={'role'}
                        />
                      </div>
                    )
                  }
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

export function UserFormContent() {

}
