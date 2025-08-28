import { AddressDialog, addressSchema as addressSchema } from '@/pages/projects/address-form';
import { BreadcrumbItem, DialogFormProps, User } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Circle, LocationEdit, MoreHorizontal, PencilIcon, Plus, Trash2Icon } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';
import { useReactiveForm, useResource } from '@/hooks/use-form';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { useExternalState } from '@/hooks/use-external-state';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Inspectors',
    href: '/inspectors',
  },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <Link href={`/inspectors/${row.original.id}/edit`}>{row.original.name}</Link>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 30000,
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className={'text-blue-500 hover:underline'}>
        {row.original.email}
      </a>
    ),
  },
  // hourly rate
  {
    accessorKey: 'inspector_profile.hourly_rate',
    header: 'Hourly Rate',
    cell: ({ row }) => <span>{row.original.inspector_profile?.hourly_rate != null ? `$${row.original.inspector_profile?.hourly_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'inspector_profile.travel_rate',
    header: 'Travel Rate',
    cell: ({ row }) => <span>{row.original.inspector_profile?.travel_rate != null ? `$${row.original.inspector_profile?.travel_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'inspector_profile.new_hourly_rate',
    header: 'Hourly Rate',
    cell: ({ row }) => (
      <span>{row.original.inspector_profile?.new_hourly_rate != null ? `$${row.original.inspector_profile?.new_hourly_rate}` : 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'inspector_profile.new_travel_rate',
    header: 'Travel Rate',
    cell: ({ row }) => (
      <span>{row.original.inspector_profile?.new_travel_rate != null ? `$${row.original.inspector_profile?.new_travel_rate}` : 'N/A'}</span>
    ),
  },
  {
    accessorKey: 'inspector_profile.new_rate_effective_date',
    header: 'New Rate Effective Date',
    cell: ({ row }) => <span>{row.original.inspector_profile?.new_rate_effective_date ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'inspector_profile.assigned_identifier',
    header: 'Assigned ID',
    cell: ({ row }) => <span>{row.original.inspector_profile?.assigned_identifier ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'inspector_profile.initials',
    header: 'Initials',
    cell: ({ row }) => <span>{row.original.inspector_profile?.initials ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'inspector_profile.include_on_skills_matrix',
    header: 'On Skills Matrix',
    cell: ({ row }) => (
      <span>{row.original.inspector_profile?.include_on_skills_matrix ? 'Yes' : 'No'}</span>
    ),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => <span>{row.original.address?.full_address ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'Actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({ row }) => (
      <TableCellWrapper last>
        <InspectorActions user={row.original} />
      </TableCellWrapper>
    ),
  },
];

export default function Inspectors() {
  const table = useTable('/api/v1/users', {
    columns: columns,
    defaultParams: {
      'filter[preset]': 'inspectors',
      'sort': 'name',
      'include': 'inspector_profile,address'
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  const debouncer = useDebouncer();

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}>
      <div className={'px-6'}>
        <DataTable
          left={
            <>
              <Input
                value={keywords}
                onChange={(event) => {
                  setKeywords(event.target.value);
                  debouncer(() => {
                    table.setSearchParams((prev) => {
                      prev.set('filter[keywords]', event.target.value);
                      return prev;
                    });
                  });
                }}
                placeholder={'Search by name or email'}
                className={'max-w-[250px]'}
              />
            </>
          }
          table={table}
          right={
            <InspectorForm onSubmit={() => {}}>
              <Button>
                <Plus/> New
              </Button>
            </InspectorForm>
          }
        />
      </div>
    </AppLayout>
  );
}

function InspectorActions({ user }: { user: User }) {
  // Dropdown menu with Edit and Delete options
  const table = useTableApi();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} side={'bottom'} className={'w-56'}>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuItem>
          Edit
          <DropdownMenuShortcut>
            <PencilIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => {
          if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            axios.delete(`/api/v1/users/${user.id}`).then(() => {
              table.reload();
            });
          }
        }}>
          Delete
          <DropdownMenuShortcut>
            <Trash2Icon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const inspector = z.object({
  initials: z.string().nullable().optional(),
  address_id: z.number().nullable().optional(),
  hourly_rate: z.number().optional(),
  travel_rate: z.number().optional(),
  new_hourly_rate: z.number().nullable().optional(),
  new_travel_rate: z.number().nullable().optional(),
  new_rate_effective_date: z.date().or(z.string()).nullable().optional(),
  assigned_identifier: z.string().nullable().optional(),
  include_on_skills_matrix: z.boolean(),
  notes: z.string().nullable().optional(),
});

const schema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  inspector_profile: inspector,
  password: z.string().min(8).optional().nullable(),
  password_confirmation: z.string().optional().nullable(),
  address: addressSchema.optional()
});


export function InspectorForm(props: DialogFormProps<User>) {
  const form = useReactiveForm<z.infer<typeof schema>, User>({
    ...useResource<User>('/api/v1/inspectors', {
      title: '',
      first_name: '',
      last_name: '',
      email: '',
      inspector_profile: {
        hourly_rate: 0,
        travel_rate: 0,
        include_on_skills_matrix: true,
        initials: ''
      },
      ...props.value
    }),
    resolver: zodResolver(schema) as any,
  });

  const [open, setOpen] = useExternalState<boolean>(props.open ?? false);

  function save() {
    form.submit().then(res => {
      if (res) {
        props.onOpenChange?.(false);
        setOpen(false);
        props.onSubmit(res.data);
      }
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        props.onOpenChange?.(open);
        setOpen(open);
      }}>
        {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspector (FieldOps)</DialogTitle>
            <DialogDescription>Fill in the details below to create or update the inspector.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
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
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Hourly Rate'}>
                          <Input
                            type={'number'}
                            step={'0.01'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.hourly_rate'}
                  />
                </div>

                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Travel Rate'}>
                          <Input
                            type={'number'}
                            step={'0.01'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.travel_rate'}
                  />
                </div>

                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'New Hourly Rate'}>
                          <Input
                            type={'number'}
                            step={'0.01'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) || 0 : null)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.new_hourly_rate'}
                  />
                </div>

                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'New Travel Rate'}>
                          <Input
                            type={'number'}
                            step={'0.01'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) || 0 : null)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.new_travel_rate'}
                  />
                </div>

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'New Rate Effective Date'}>
                          <DatePicker
                            value={field.value || ''}
                            onChange={(value) => {
                              field.onChange(value ? dayjs(value).format('YYYY-MM-DD') : null);
                            }}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.new_rate_effective_date'}
                  />
                </div>

                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Initials'}>
                          <Input
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder={''}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.initials'}
                  />
                </div>
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Assigned ID'}>
                          <Input
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder={''}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.assigned_identifier'}
                  />
                </div>

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <div className={'flex items-center space-x-2'}>
                          <Checkbox
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                            id={'include_on_skills_matrix'}
                          />
                          <label htmlFor={'include_on_skills_matrix'} className={'text-sm'}>
                            Include on skills matrix
                          </label>
                        </div>
                      );
                    }}
                    name={'inspector_profile.include_on_skills_matrix'}
                  />
                </div>
                <div className={'col-span-12'}>
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
                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Password'}>
                          <Input autoComplete={'new-password'} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
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
                        <VFormField label={'Confirm Password'}>
                          <Input autoComplete={'new-password'} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                        </VFormField>
                      );
                    }}
                    name={'password_confirmation'}
                  />
                </div>

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Notes'}>
                          <Textarea
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder={'Additional notes about this inspector...'}
                            rows={3}
                          />
                        </VFormField>
                      );
                    }}
                    name={'inspector_profile.notes'}
                  />
                </div>
              </Form>
            </div>
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'} type={'button'}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={form.submitDisabled} onClick={save}>
              {form.formState.isSubmitting ? (<Circle className={'animate-spin'}/>) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
