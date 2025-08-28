import AppLayout from '@/layouts/app-layout';
import { Assignment, BreadcrumbItem, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { ClipboardTypeIcon, CopyIcon, EllipsisVertical, Eye, Mail, MessageSquare, PlusIcon, Trash2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AssignmentForm } from '@/pages/assignments/form';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { ProjectSelect } from '@/components/project-select';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { toast } from 'sonner';
import { download } from '@/lib/download-response-as-blob';
import { ClientSelect } from '@/components/client-select';
import { useIsClient } from '@/hooks/use-role';
import dayjs from 'dayjs';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Assignments',
    href: route('assignments')
  }
];


export default function AssignmentsPage() {
  const {table, content} = useAssignmentsTable();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <AssignmentForm
          open={open}
          onOpenChange={setOpen}
          onSubmit={() => {table.reload()}}>
          <Button onClick={() => {setCount(count + 1)}}>
            <PlusIcon/> New
          </Button>
        </AssignmentForm>
      }>
      <div className={'px-6'}>{ content }</div>
    </AppLayout>
  );
}

interface AssignmentActionsProps {
  assignment: Assignment;
  hideDetails?: boolean;
}
export function AssignmentActions({ assignment, ...props }: AssignmentActionsProps) {
  const isClient = useIsClient();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" side={'bottom'} align={'end'}>
          <DropdownMenuLabel className={'flex items-center gap-2 justify-between'}>
            <span>Assignment</span> <span>#{assignment.id}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            { isClient ? (
              <DropdownMenuItem
                onClick={() => {
                  alert('Not available yet');
                }}>
                New NOI
                <DropdownMenuShortcut>
                  <CopyIcon/>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ) : null}
            {props.hideDetails ? null : (
              <DropdownMenuItem
                onClick={() => {
                  router.visit(route('assignments.edit', { id: assignment.id }));
                }}>
                View Details
                <DropdownMenuShortcut>
                  <Eye/>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            { isClient ? null : (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    toast.message('Generating PDF...');
                    axios.get('/api/v1/assignments/' + assignment.id + '/pdf', { responseType: 'blob' })
                      .then((response) => {
                        download(response);
                        toast.success('PDF generated successfully!');
                      })
                      .catch((error) => {
                        console.error('Error generating PDF:', error);
                        toast.error('Failed to generate PDF.');
                      }
                    );
                  }}>
                  Assignment Form (PDF)
                  <DropdownMenuShortcut>
                    <ClipboardTypeIcon/>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
            { isClient ? null : (
              <DropdownMenuItem
                  onClick={() => {
                    axios.get('/api/v1/assignments/' + assignment.id + '/link').then(
                      (response) => {
                        navigator.clipboard.writeText(response.data['data']);
                        toast.success('Link copied to clipboard!');
                      }
                    );
                  }}>
                  Copy Link for Inspector
                  <DropdownMenuShortcut>
                    <CopyIcon/>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
            )}
            { isClient ? null : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Notify Inspector</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        axios.post('/api/v1/assignments/' + assignment.id + '/notify-inspector');
                      }}>
                      Email
                      <DropdownMenuShortcut>
                        <Mail/>
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      SMS
                      <DropdownMenuShortcut>
                        <MessageSquare/>
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            {isClient ? null : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Delete</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem variant={'destructive'}>
                      Confirm
                      <DropdownMenuShortcut>
                        <Trash2 className={'text-red-500'}/>
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const po_column: ColumnDef<Assignment> = {
    accessorKey: 'po',
    header: 'PO',
    cell: ({ row }) => {
      return (
        <Link href={route('purchase-orders.edit', { id: row.original.purchase_order?.id })} className={'underline'}>
          {row.original.purchase_order?.title}
        </Link>
      );
    }
}

interface UseAssignmentsTableOptions {
  project?: Project
}

export function useAssignmentsTable(options: UseAssignmentsTableOptions = {}) {
  const isClient = useIsClient();

  const columns: ColumnDef<Assignment>[] = [
    // reference_number
    {
      accessorKey: 'reference_number',
      header: 'BIE reference number',
      cell: ({ row }) => (
        <Link href={route('assignments.edit', { id: row.original.id})} className={'underline'}>
          {row.original.reference_number}
        </Link>
      )
    },
    // Date recorded
    {
      accessorKey: 'created_at',
      header: 'Date recorded',
      cell: ({ row }) => (
        dayjs(row.original.created_at).format('DD/MM/YYYY')
      )
    },
    {
      id: 'client_id',
      accessorKey: 'client_id',
      header: 'Client',
      cell: ({ row }) => {
        return <>
          <Link href={route('clients.edit', { id: row.original.project?.client_id })} className={'underline'}>
            {row.original.project?.client?.business_name}
          </Link>
        </>;
      }
    },
    {
      id: 'client_id',
      accessorKey: 'client_id',
      header: 'Client',
      cell: ({ row }) => {
        return <>
          <Link href={route('clients.edit', { id: row.original.project?.client_id })} className={'underline'}>
            {row.original.project?.client?.code}
          </Link>
        </>;
      }
    },
    {
      id: 'project_id',
      accessorKey: 'project_id',
      header: 'Project',
      cell: ({ row }) => {
        return <>
          <Link href={route('projects.edit', { id: row.original.project_id })} className={'underline'}>
            {row.original.project?.title ?? row.original.project_id}
          </Link>
        </>;
      }
    },
    // {
    //   accessorKey: 'assignment_type_id',
    //   header: 'Type',
    //   cell: ({ row }) => {
    //     return <Badge variant={'secondary'}>{row.original.assignment_type?.name ?? '-'}</Badge>;
    //   },
    //   size: 100,
    // },
    ...(
      isClient ? [] : [
        po_column
      ]
    ),
    {
      accessorKey: 'client_po',
      header: 'Client PO',
      cell: ({ row }) => (
        row.original.client_po ?? '-'
      )
    },
    {
      accessorKey: 'client_po_rev',
      header: 'Client PO',
      cell: ({ row }) => (
        row.original.client_po_rev ?? '-'
      )
    },
    {
      accessorKey: 'vendor_id',
      header: 'Vendor',
      cell: ({ row }) => {
        return row.original.vendor?.name ?? '-';
      }
    },
    {
      accessorKey: 'vendor_id',
      header: 'Vendor',
      cell: ({ row }) => {
        return row.original.sub_vendor?.name ?? '-';
      }
    },
    {
      accessorKey: 'equipment_description',
      header: 'Equipment Description',
      cell: ({ row }) => (
        row.original.equipment ?? '-'
      )
    },
    {
      accessorKey: 'coordinating_office',
      header: 'Coordinating Office',
      cell: ({ row }) => (
        row.original.org?.name ?? '-'
      )
    },
    {
      accessorKey: 'equipment_category',
      header: 'Equipment Category',
      cell: ({ row }) => (
        row.original.equipment_category?.name ?? '-'
      )
    },
    // Notes
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => (
        row.original.notes
      )
    },
    // po_delivery_date
    {
      accessorKey: 'po_delivery_date',
      header: 'PO Delivery Date',
      cell: ({ row }) => (
        row.original.po_delivery_date ? dayjs(row.original.po_delivery_date).format('DD/MM/YYYY') : '-'
      )
    },
    // budgeted hours
    {
      accessorKey: 'budgeted_hours',
      header: 'Budgeted Hours',
      cell: ({ row }) => (
        row.original.purchase_order?.budgeted_hours
      )
    },
    {
      accessorKey: 'budgeted_hours',
      header: 'Budgeted Hours',
      cell: ({ row }) => (
        row.original.purchase_order?.budgeted_mileage
      )
    },
    // assignment status
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        row.original.status
      )
    },
    // date closed
    {
      accessorKey: 'date_closed',
      header: 'Date Closed',
      cell: ({ row }) => (
        row.original.date_closed ? dayjs(row.original.date_closed).format('DD/MM/YYYY') : '-'
      )
    },
    // final invoice
    {
      accessorKey: 'final_invoice_date',
      header: 'Final Invoice',
      cell: ({ row }) => (
        row.original.final_invoice_date ? dayjs(row.original.final_invoice_date).format('DD/MM/YYYY') : '-'
      )
    },
    // original job number
    {
      accessorKey: 'original_job_number',
      header: 'Original Job Number',
      cell: ({ row }) => (
        row.original.original_job_number ?? '-'
      )
    },

    // new job number
    {
      accessorKey: 'new_job_number',
      header: 'New Job Number',
      cell: ({ row }) => (
        row.original.new_job_number ?? '-'
      )
    },

    // project type
    {
      accessorKey: 'project_type',
      header: 'Project Type',
      cell: ({ row }) => (
        row.original.project?.project_type?.name ?? '-'
      )
    },

    {
      accessorKey: 'actions',
      header: () => (
        <TableCellWrapper last>
          Actions
        </TableCellWrapper>
      ),
      cell: ({ row }) => {
        return (
          <TableCellWrapper last>
            <AssignmentActions assignment={row.original}/>
          </TableCellWrapper>
        );
      }
    }
  ];

  const table = useTable('/api/v1/assignments', {
    columns: columns.filter((column) => {
      if (options.project) {
        if (['project_id', 'client_id'].indexOf(column.id || '') !== -1) {
          return false;
        }
      }
      return true;
    }),
    defaultParams: {
      'include': 'project.client,assignment_type,vendor,sub_vendor,operation_org,org,inspector,purchase_order',
      'sort': 'created_at',
      'filter[project_id]': String(options.project?.id ?? '')
    }
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') ?? '');
  const debouncer = useDebouncer();

  const project_selector = (
    options.project ? null : (
      <ProjectSelect
        value={Number(table.searchParams.get('filter[project_id]'))}
        onValueChane={(value) => {
          table.setSearchParams((params) => {
            if (value) {
              params.set('filter[project_id]', String(value));
            } else {
              params.delete('filter[project_id]');
            }
            return params;
          })
        }}
        renderTrigger={(project) => {
          return (
            <Button variant={'outline'}>
              Project: <Badge variant={'secondary'}>{project?.title ?? 'All'}</Badge>
            </Button>
          );
        }}/>
    )
  )

  return {
    table,
    content: (
      <>
        <DataTable
          table={table}
          left={<>
            <Input
              value={keywords}
              onChange={(event) => {
                setKeywords(event.target.value);
                debouncer(() => {
                  table.setSearchParams((params) => {
                    params.set('filter[keywords]', event.target.value);
                    return params;
                  })
                })
              }}
              className={'max-w-[250px]'}
              placeholder={'Search...'}
            />
            {project_selector}
            <>
              {options.project ? null : (
                isClient ? null : (
                  <ClientSelect
                    onValueChane={(value) => {
                      table.setSearchParams((params) => {
                        if (value) {
                          params.set('filter[client_id]', String(value));
                        } else {
                          params.delete('filter[client_id]');
                        }
                        return params;
                      })
                    }}
                    value={Number(table.searchParams.get('filter[client_id]')) || null}
                    renderTrigger={(client) => {
                      return (
                        <Button variant={'outline'}>
                          Client: <Badge variant={'secondary'}>{client?.business_name ?? 'All'}</Badge>
                        </Button>
                      );
                    }}
                  />
                )
              )}
            </>
          </>}
          right={
            <>
              <ColumnToggle/>
            </>
          }
        />
      </>
    )
  }
}
