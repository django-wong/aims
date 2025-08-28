import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { LocationEdit } from 'lucide-react';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addressSchema, AddressDialog } from '@/pages/projects/address-form';
import { BaseLayout } from '@/layouts/base-layout';

export default function Setup() {
  return (
    <>
      <Head title="Setup new office">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-bold text-3xl ">
            AIMS
          </a>
          <SetupForm />
        </div>
      </div>
    </>
  );
}


const schema = z.object({
  name: z.string().min(2, { message: 'Name is required' }).max(50, { message: 'Name must be less than 50 characters' }),
  code: z.string().min(2, { message: 'Code is required' }).max(10, { message: 'Code must be less than 10 characters' }),
  address: addressSchema.optional(),
  admin: z.object({
    first_name: z.string().min(1, { message: 'First name is required' }),
    last_name: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    password_confirmation: z.string().min(6, { message: 'Password confirmation must be at least 6 characters' }),
  })
});

function SetupForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/orgs',
    defaultValues: {
      name: 'My awesome office',
      code: 'MAO',
      address: undefined,
      admin: {
        first_name: 'Admin',
        last_name: 'User',
        email: 'me@djangowong.com',
        password: 'password',
        password_confirmation: 'password',
      }
    },
    resolver: zodResolver(schema)
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    form.submit(event).then((res) => {
      if (res) {
        form.reset({
          name: '',
          code: '',
          address: undefined,
          admin: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: ''
          }
        });
      }
    })
  }

  return (
    <BaseLayout>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Setup new office</CardTitle>
            <CardDescription>Provide a bit details to get started.</CardDescription>
          </CardHeader>

          <div className={'mx-6 border-t'} />

          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <h3 className="text-lg font-semibold">Profile</h3>

                    <FormField
                      control={form.control}
                      render={({field}) => (
                        <VFormField
                          label={'Name'}>
                          <Input
                            {...field}
                            id="name"
                            type="text"
                          />
                        </VFormField>
                      )}
                      name={'name'}
                    />

                    <FormField
                      control={form.control}
                      render={({field}) => (
                        <VFormField label={'Code'}>
                          <Input {...field} type="text"/>
                        </VFormField>
                      )}
                      name={'code'}
                    />

                    <div>
                      <FormField
                        control={form.control}
                        name={'address'}
                        render={({field}) => {
                          return (
                            <VFormField
                              label={'Address'}
                            >
                              <div className={'flex items-center gap-2  p-4 rounded-md border shadow-xs border-border bg-background'}>
                                <div className={'text-sm flex-1'}>
                                  {field.value?.address_line_1 ? (
                                    <>
                                      <p>{field.value?.address_line_1}</p>
                                      <p>
                                        {field.value?.city}, {field.value?.state}, {field.value?.zip}, {field.value?.country}
                                      </p>
                                    </>
                                  ) : (
                                    <p className={'text-muted-foreground'}>No address provided</p>
                                  )}
                                </div>
                                <AddressDialog value={field.value} onChange={field.onChange}>
                                  <Button variant={'secondary'} size={'sm'}>
                                    <LocationEdit/> Edit Address
                                  </Button>
                                </AddressDialog>
                              </div>
                            </VFormField>
                          );
                        }}
                      />
                    </div>

                    <h3 className="text-lg font-semibold">Initial User</h3>

                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          render={({field}) => (
                            <VFormField label={'First Name'}>
                              <Input {...field} type="text"/>
                            </VFormField>
                          )}
                          name={'admin.first_name'}
                        />
                        <FormField
                          control={form.control}
                          render={({field}) => (
                            <VFormField label={'Last Name'}>
                              <Input {...field} type="text"/>
                            </VFormField>
                          )}
                          name={'admin.last_name'}
                        />
                        <div className={'col-span-2'}>
                          <FormField
                            control={form.control}
                            render={({field}) => (
                              <VFormField label={'Email'}>
                                <Input {...field} type="email"/>
                              </VFormField>
                            )}
                            name={'admin.email'}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          render={({field}) => (
                            <VFormField label={'Password'}>
                              <Input {...field} type="password"/>
                            </VFormField>
                          )}
                          name={'admin.password'}
                        />
                        <FormField
                          control={form.control}
                          render={({field}) => (
                            <VFormField label={'Confirm Password'}>
                              <Input {...field} type="password"/>
                            </VFormField>
                          )}
                          name={'admin.password_confirmation'}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">Continue</Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
