import { DataTable, useTableApi } from '@/components/data-table-2';
import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { VisibleToStaffAndAbove } from '@/components/hide-from-client';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Textarea } from '@/components/ui/textarea';
import { StaffSelect } from '@/components/user-select';
import { VFormField } from '@/components/vform';
import { useDebouncer } from '@/hooks/use-debounced';
import { useExternalState } from '@/hooks/use-external-state';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { AddressDialog, addressSchema } from '@/pages/projects/address-form';
import { Address, BreadcrumbItem, DialogFormProps, InspectorProfile, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import dayjs from 'dayjs';
import { Circle, LocationEdit, MoreHorizontal, Plus, ScanFace, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

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

const columns: ColumnDef<InspectorProfile & User & Address>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link className={'underline'} href={`/inspectors/${row.original.id}/edit`}>
        {row.original.name}
      </Link>
    ),
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
    accessorKey: 'hourly_rate',
    header: 'Hourly Rate',
    cell: ({ row }) => <span>{row.original.hourly_rate != null ? `$${row.original.hourly_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'travel_rate',
    header: 'Travel Rate',
    cell: ({ row }) => <span>{row.original.travel_rate != null ? `$${row.original.travel_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'new_hourly_rate',
    header: 'New Hourly Rate',
    cell: ({ row }) => <span>{row.original.new_hourly_rate != null ? `$${row.original.new_hourly_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'new_travel_rate',
    header: 'New Travel Rate',
    cell: ({ row }) => <span>{row.original.new_travel_rate != null ? `$${row.original.new_travel_rate}` : 'N/A'}</span>,
  },
  {
    accessorKey: 'new_rate_effective_date',
    header: 'New Rate Effective Date',
    cell: ({ row }) => <span>{row.original.new_rate_effective_date ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'assigned_identifier',
    header: 'Assigned ID',
    cell: ({ row }) => <span>{row.original.assigned_identifier ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'initials',
    header: 'Initials',
    cell: ({ row }) => <span>{row.original.initials ?? 'N/A'}</span>,
  },
  {
    accessorKey: 'include_on_skills_matrix',
    header: 'On Skills Matrix',
    cell: ({ row }) => <span>{row.original.include_on_skills_matrix ? 'Yes' : 'No'}</span>,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => <span>{row.original.full_address ?? 'N/A'}</span>,
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
  const table = useTable<InspectorProfile & User & Address>('/api/v1/inspector-profiles', {
    columns: columns,
    defaultParams: {
      sort: 'name',
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  const debouncer = useDebouncer();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
            <InspectorForm
              onSubmit={() => {
                table.reload();
              }}
            >
              <Button>
                <Plus /> New
              </Button>
            </InspectorForm>
          }
        />
      </div>
    </AppLayout>
  );
}

function InspectorActions({ user }: { user: InspectorProfile & User }) {
  // Dropdown menu with Edit and Delete options
  const table = useTableApi();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={'end'} side={'bottom'} className={'w-56'}>
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <VisibleToStaffAndAbove>
          <Link href={route('impersonate', { id: user.user_id })}>
            <DropdownMenuItem>
              Impersonate
              <DropdownMenuShortcut>
                <ScanFace className={'size-4'} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </VisibleToStaffAndAbove>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
              axios.delete(`/api/v1/inspector-profiles/${user.id}`).then(() => {
                table.reload();
              });
            }
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2Icon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const inspector_profile = z.object({
  initials: z.string().nullable().optional(),
  address_id: z.number().nullable().optional(),
  hourly_rate: z.coerce.number().min(1),
  travel_rate: z.coerce.number().min(1),
  new_hourly_rate: z.coerce.number().min(1).nullable().optional(),
  new_travel_rate: z.coerce.number().min(1).nullable().optional(),
  new_rate_effective_date: z.date().or(z.string()).nullable().optional(),
  assigned_identifier: z.string().nullable().optional(),
  include_on_skills_matrix: z.boolean(),
  notes: z.string().nullable().optional(),
  address: addressSchema.optional().nullable(),
});

const schema = z.union([
  inspector_profile.extend({
    for_user_id: z.literal('').nullable().optional(),
    user: z.object({
      title: z.string().optional().nullable(),
      first_name: z.string().min(1, 'First name is required'),
      last_name: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8).optional().nullable(),
      password_confirmation: z.string().optional().nullable(),
    }),

  }),
  inspector_profile.extend({
    for_user_id: z.number(),
  })
]);

export function InspectorForm(props: DialogFormProps<User>) {
  const form = useReactiveForm<z.infer<typeof schema>, User>({
    ...useResource<User>('/api/v1/inspector-profiles', {
      for_user_id: null,
      hourly_rate: 0,
      travel_rate: 0,
      include_on_skills_matrix: true,
      initials: '',
      user: {
        title: '',
        first_name: '',
        last_name: '',
        email: '',
      },
      ...props.value,
    }),
    resolver: zodResolver(schema) as any,
  });

  const [open, setOpen] = useExternalState<boolean>(props.open ?? false);

  const create_profile_for_existing_user = form.watch('for_user_id');
  const is_updating = !!props.value;

  function save() {
    form.submit().then((res) => {
      if (res) {
        props.onOpenChange?.(false);
        setOpen(false);
        props.onSubmit?.(res.data);
      }
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          props.onOpenChange?.(open);
          setOpen(open);
        }}
      >
        {props.children && <DialogTrigger asChild>{props.children}</DialogTrigger>}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspector (FieldOps)</DialogTitle>
            <DialogDescription>Fill in the details below to create or update the inspector.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            <div className={'grid grid-cols-12 gap-6'}>
              <Form {...form}>
                {
                  is_updating ? null : (
                    <div className={'col-span-12'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <VFormField label={'Existing Staff (Optional)'} description={'Select an existing staff member or create new inspector account with minimal permission.'}>
                              <StaffSelect params={{
                                'filter[exclude_inspectors]': '1',
                              }} onValueChane={field.onChange} value={field.value ? field.value : null} />
                            </VFormField>
                          );
                        }}
                        name={'for_user_id'}
                      />
                    </div>
                  )
                }

                {create_profile_for_existing_user ? null : (
                  <>
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
                        name={'user.title'}
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
                        name={'user.first_name'}
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
                        name={'user.last_name'}
                      />
                    </div>
                    <div className={'col-span-12'}>
                      <FormField
                        control={form.control}
                        render={({ field }) => {
                          return (
                            <VFormField required label={'Email'}>
                              <Input
                                autoComplete={'email'}
                                placeholder={'example@mail.com'}
                                type={'email'}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </VFormField>
                          );
                        }}
                        name={'user.email'}
                      />
                    </div>
                    <div className={'col-span-12'}>
                      <FormField
                        control={form.control}
                        name={'address'}
                        render={({ field }) => {
                          return (
                            <VFormField label={'Address'}>
                              <div className={'border-border bg-background flex items-center gap-2 rounded-md border p-4 shadow-xs'}>
                                <div className={'flex-1 text-sm'}>
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
                                    <LocationEdit /> Edit Address
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
                            <VFormField
                              label={'Password'}
                              required={!props.value}
                              description={props.value ? 'Leave blank to keep the current password' : ''}
                            >
                              <Input autoComplete={'new-password'} type={'password'} value={field.value ?? ''} onChange={field.onChange} />
                            </VFormField>
                          );
                        }}
                        name={'user.password'}
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
                        name={'user.password_confirmation'}
                      />
                    </div>
                  </>
                )}
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Hourly Rate'}>
                          <Input
                            type={'number'}
                            step={'10'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'hourly_rate'}
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
                            step={'10'}
                            min={'0'}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                            placeholder={'0.00'}
                          />
                        </VFormField>
                      );
                    }}
                    name={'travel_rate'}
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
                    name={'new_hourly_rate'}
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
                    name={'new_travel_rate'}
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
                    name={'new_rate_effective_date'}
                  />
                </div>

                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Initials'}>
                          <Input value={field.value ?? ''} onChange={field.onChange} placeholder={''} />
                        </VFormField>
                      );
                    }}
                    name={'initials'}
                  />
                </div>
                <div className={'col-span-6'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <VFormField label={'Assigned ID'}>
                          <Input value={field.value ?? ''} onChange={field.onChange} placeholder={''} />
                        </VFormField>
                      );
                    }}
                    name={'assigned_identifier'}
                  />
                </div>

                <div className={'col-span-12'}>
                  <FormField
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <div className={'flex items-center space-x-2'}>
                          <Checkbox checked={field.value ?? true} onCheckedChange={field.onChange} id={'include_on_skills_matrix'} />
                          <label htmlFor={'include_on_skills_matrix'} className={'text-sm'}>
                            Include on skills matrix
                          </label>
                        </div>
                      );
                    }}
                    name={'include_on_skills_matrix'}
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
                    name={'notes'}
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
              {form.formState.isSubmitting ? <Circle className={'animate-spin'} /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
