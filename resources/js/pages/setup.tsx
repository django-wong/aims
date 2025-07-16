import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { GalleryVerticalEnd } from 'lucide-react';
import { VFormField } from '@/components/vform';
import { useReactiveForm } from '@/hooks/use-form';
import { Textarea } from '@/components/ui/textarea';

export default function Setup() {
  return (
    <>
      <Head title="Setup your business">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            AIMS Inc.
          </a>

          <SetupForm />
        </div>
      </div>
    </>
  );
}

function SetupForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { register, formState, setValue, submit } = useReactiveForm({
    url: '/api/v1/businesses',
    defaultValues: {
      name: 'Goodies Company',
      domain: 'goodies',
      business_bio: 'We are a company that provides goodies to everyone.',
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    submit().then((res) => {
      if (res) {
        window.location.href = route('dashboard');
      }
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Setup your business</CardTitle>
          <CardDescription>Provide your business details to get started.</CardDescription>
        </CardHeader>

        <div className={'mx-6 border-t'} />

        <CardContent>
          <div>
            <form onSubmit={onSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <VFormField
                    error={formState.errors.name?.message}
                    label={'Business Name'}
                    for={'name'}>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your business name"
                      {...register('name')}
                    />
                  </VFormField>

                  <VFormField
                    label={'Domain'}
                    for={'domain'}
                    renderLabel={(props) => (
                      <div className="flex items-center">
                        <Label htmlFor={props.for}>{props.label}</Label>
                        <a href="#" className="ml-auto text-xs underline-offset-4 hover:underline">
                          What is this?
                        </a>
                      </div>
                    )}
                    error={formState.errors.domain?.message}
                  >
                    <div className={'flex items-center justify-start gap-1'}>
                      <span className={'text-gray-500'}>https://aims.com/</span>
                      <Input
                        id="domain"
                        type="text"
                        {...register('domain')}
                        onChange={(event) => {
                          const value = event.target.value.replace(/[^a-z0-9-]/g, '-').toLowerCase();
                          event.target.value = value;
                          setValue('domain', value);
                        }}
                      />
                    </div>
                  </VFormField>

                  <VFormField label={'Bio'} for={'business_bio'} error={formState.errors.business_bio?.message}>
                    <Textarea
                      id="business_bio"
                      placeholder="A short description of your business"
                      {...register('business_bio')}
                    />
                  </VFormField>

                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
