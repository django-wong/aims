import { CertificateLevelSelect } from '@/components/certificate-level-select';
import { CertificateTechniqueSelect } from '@/components/certificate-technique-select';
import { CertificateTypeSelect } from '@/components/certificate-type-select';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { DatePicker } from '@/components/date-picker';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { PopoverConfirm } from '@/components/popover-confirm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { VFormField } from '@/components/vform';
import { useDebouncer } from '@/hooks/use-debounced';
import { useReactiveForm } from '@/hooks/use-form';
import { useTable } from '@/hooks/use-table';
import { Certificate, DialogFormProps, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { format } from 'date-fns';
import { EditIcon, Plus, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import z from 'zod';
import { formatDate } from '@/lib/helpers';
import dayjs from 'dayjs';

const certificates_columns: ColumnDef<Certificate>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: 'certificate_type',
    header: 'Type',
    cell: ({ row }) => <span>{row.original.certificate_type?.name || 'N/A'}</span>,
  },
  {
    accessorKey: 'certificate_technique',
    header: 'Technique',
    cell: ({ row }) => <span>{row.original.certificate_technique?.name || 'N/A'}</span>,
  },
  {
    accessorKey: 'certificate_level',
    header: 'Level',
    cell: ({ row }) => <span>{row.original.certificate_level?.name || 'N/A'}</span>,
  },
  {
    accessorKey: 'issued_at',
    header: 'Issued Date',
    cell: ({ row }) => {
      if (!row.original.issued_at) return <span className="text-muted-foreground">N/A</span>;
      return (
        <div className="flex items-center gap-2">
          <span>{format(new Date(row.original.issued_at), 'MMM dd, yyyy')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'expires_at',
    header: 'Expires',
    cell: ({ row }) => {
      if (!row.original.expires_at) return <span className="text-muted-foreground">Never</span>;

      const expiryDate = new Date(row.original.expires_at);
      const today = new Date();
      const isExpired = expiryDate < today;
      const isExpiringSoon = expiryDate < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      return (
        <div className="flex items-center gap-2">
          <span className={isExpired ? 'text-destructive' : isExpiringSoon ? 'text-yellow-600' : ''}>{format(expiryDate, 'MMM dd, yyyy')}</span>
          {isExpired && <Badge variant="destructive">Expired</Badge>}
          {!isExpired && isExpiringSoon && <Badge variant="secondary">Expiring Soon</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: 'Actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({ row }) => (
      <TableCellWrapper last>
        <CertificateActions certificate={row.original} />
      </TableCellWrapper>
    ),
  },
];

function CertificateActions({ certificate }: { certificate: Certificate }) {
  const table = useTableApi();

  return (
    <div className="flex items-center gap-1 justify-end">
      <CertificateForm value={certificate} onSubmit={() => table.reload()} mode="edit">
        <Button size={'sm'} variant={'secondary'}>
          <EditIcon />
        </Button>
      </CertificateForm>

      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure you want to delete this certificate? This action cannot be undone.'}
        onConfirm={() => {
          axios.delete(`/api/v1/certificates/${certificate.id}`).then(() => {
            table.reload();
          });
        }}
        asChild
      >
        <Button size={'sm'} variant={'secondary'}>
          <Trash2Icon className={'stroke-destructive'} />
        </Button>
      </PopoverConfirm>
    </div>
  );
}

interface UserCertificatesProps {
  inspector: User;
}

export function UserCertificates(props: UserCertificatesProps) {
  const table = useTable(`/api/v1/certificates`, {
    columns: certificates_columns,
    defaultParams: {
      'filter[user_id]': String(props.inspector.id),
      include: 'certificate_type,certificate_technique,certificate_level',
      sort: '-created_at',
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');
  const debouncer = useDebouncer();

  return (
    <div>
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
              placeholder={'Search certificates...'}
              className={'max-w-[250px]'}
            />
            <CertificatesFilters/>
          </>
        }
        table={table}
        right={
          <CertificateForm value={props.inspector} onSubmit={() => table.reload()} mode="create">
            <Button>
              <Plus /> Add Certificate
            </Button>
          </CertificateForm>
        }
      />
    </div>
  );
}

const schema = z
  .object({
    user_id: z.number().min(1),
    certificate_type_id: z.number().nullable().optional(),
    certificate_technique_id: z.number().nullable().optional(),
    certificate_level_id: z.number().nullable().optional(),
    title: z.string().min(1, 'Title is required').max(255),
    issued_at: z.string().nullable().optional(),
    expires_at: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.issued_at && data.expires_at) {
        return new Date(data.expires_at) >= new Date(data.issued_at);
      }
      return true;
    },
    {
      message: 'Expiry date must be after or equal to issued date',
      path: ['expires_at'],
    },
  );

interface CertificateFormProps extends DialogFormProps<User | Certificate, Certificate> {
  mode: 'create' | 'edit';
}

function CertificateForm(props: CertificateFormProps) {
  const isEdit = props.mode === 'edit';
  const certificate = isEdit ? (props.value as Certificate) : null;
  const user = isEdit ? certificate?.user : (props.value as User);

  const form = useReactiveForm<z.infer<typeof schema>, Certificate>({
    url: isEdit ? `/api/v1/certificates/${certificate?.id}` : '/api/v1/certificates',
    method: isEdit ? 'PUT' : 'POST',
    defaultValues: isEdit
      ? {
          user_id: certificate?.user_id,
          certificate_type_id: certificate?.certificate_type_id,
          certificate_technique_id: certificate?.certificate_technique_id,
          certificate_level_id: certificate?.certificate_level_id,
          title: certificate?.title || '',
          issued_at: certificate?.issued_at || null,
          expires_at: certificate?.expires_at || null,
        }
      : {
          user_id: user?.id,
          certificate_type_id: null,
          certificate_technique_id: null,
          certificate_level_id: null,
          title: '',
          issued_at: null,
          expires_at: null,
        },
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState(false);

  function submit(close: boolean = true) {
    form.submit().then((res) => {
      if (res) {
        props.onSubmit?.(res.data);
        if (close) {
          setOpen(false);
        } else {
          // Reset form for creating another certificate
          form.reset({
            user_id: user?.id,
            certificate_type_id: null,
            certificate_technique_id: null,
            certificate_level_id: null,
            title: '',
            issued_at: null,
            expires_at: null,
          });
        }
      }
    });
  }

  const issued_at = form.watch('issued_at');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Certificate' : 'Add Certificate to Inspector'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update the certificate details below.' : 'Add a new certificate for this inspector.'}</DialogDescription>
        </DialogHeader>
        <DialogInnerContent>
          <Form {...form}>
            <div className="grid gap-4">
              <FormField
                render={({ field }) => (
                  <VFormField label={'Title'} required>
                    <Input {...field} value={field.value || ''} placeholder="e.g., AWS Certified Solutions Architect" />
                  </VFormField>
                )}
                name={'title'}
                control={form.control}
              />

              <FormField
                render={({ field }) => (
                  <VFormField label={'Certificate Type'}>
                    <CertificateTypeSelect value={field.value || null} onValueChane={(value) => field.onChange(value)} placeholder={'Choose certificate type'} />
                  </VFormField>
                )}
                name={'certificate_type_id'}
                control={form.control}
              />

              <FormField
                render={({ field }) => (
                  <VFormField label={'Technique'}>
                    <CertificateTechniqueSelect value={field.value || null} onValueChane={(value) => field.onChange(value)} placeholder={'Choose technique'} />
                  </VFormField>
                )}
                name={'certificate_technique_id'}
                control={form.control}
              />

              <FormField
                render={({ field }) => (
                  <VFormField label={'Level'}>
                    <CertificateLevelSelect value={field.value || null} onValueChane={(value) => field.onChange(value)} placeholder={'Choose level'} />
                  </VFormField>
                )}
                name={'certificate_level_id'}
                control={form.control}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  render={({ field }) => (
                    <VFormField label={'Issued Date'}>
                      <DatePicker
                        calendar={{
                          captionLayout: 'dropdown'
                        }}
                        value={field.value || undefined}
                        onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY/MM/DD') : null)}
                      />
                    </VFormField>
                  )}
                  name={'issued_at'}
                  control={form.control}
                />

                <FormField
                  render={({ field }) => (
                    <VFormField label={'Expiry Date'}>
                      <DatePicker
                        calendar={{
                          captionLayout: 'dropdown',
                          disabled: (date) => {
                            if (issued_at) {
                              const start = dayjs(issued_at);
                              const end = dayjs(date);
                              return end.isBefore(start, 'day');
                            }
                            return false;
                          }
                        }}
                        value={field.value || undefined}
                        onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY/MM/DD') : null)}
                      />
                    </VFormField>
                  )}
                  name={'expires_at'}
                  control={form.control}
                />
              </div>
            </div>
          </Form>
        </DialogInnerContent>
        <DialogFooter>
          {!isEdit && (
            <Button variant="outline" onClick={() => submit(false)}>
              Save & Add Another
            </Button>
          )}
          <Button onClick={() => submit(true)}>{isEdit ? 'Update Certificate' : 'Save Certificate'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export function CertificatesFilters() {
  const table = useTableApi();

  return (
    <>
      <CertificateTypeSelect
        onValueChane={(value) => {
          table.setSearchParams((prev) => {
            if (value) {
              prev.set('filter[certificate_type_id]', String(value));
            } else {
              prev.delete('filter[certificate_type_id]');
            }
            return prev;
          });
        }}
        value={parseInt(table.searchParams.get('filter[certificate_type_id]') ?? '')}
        renderTrigger={(type) => {
          return (
            <Button variant="outline">
              Type: <Badge variant={'secondary'}>{type ? type.name : 'all'}</Badge>
            </Button>
          );
        }}
      />
    </>
  );
}
