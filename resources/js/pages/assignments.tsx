import { ClientSelect } from '@/components/client-select';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { HideFromClient } from '@/components/hide-from-client';
import { ProjectSelect } from '@/components/project-select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useDebouncer } from '@/hooks/use-debounced';
import { useIsClient, useIsInspector } from '@/hooks/use-role';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { CloseDate } from '@/pages/assignments/close-date';
import { AssignmentForm } from '@/pages/assignments/form';
import { Assignment, AssignmentStatus, BreadcrumbItem, Project } from '@/types';
import { download } from '@/utils/download-response-as-blob';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  CheckIcon,
  ClipboardTypeIcon,
  CopyIcon,
  EllipsisVertical,
  Eye,
  Mail,
  MessageSquare,
  PencilIcon,
  PlusIcon,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useReload } from '@/hooks/use-reload';

export const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Assignments',
    href: route('assignments'),
  },
];

export default function AssignmentsPage() {
  const { table, content } = useAssignmentsTable();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <HideFromClient>
          <AssignmentForm
            open={open}
            onOpenChange={setOpen}
            onSubmit={() => {
              table.reload();
            }}
          >
            <Button
              onClick={() => {
                setCount(count + 1);
              }}
            >
              <PlusIcon /> New
            </Button>
          </AssignmentForm>
        </HideFromClient>
      }
    >
      <div className={'px-6'}>{content}</div>
    </AppLayout>
  );
}

interface AssignmentActionsProps {
  assignment: Assignment;
  hideDetails?: boolean;
}
export function AssignmentActions({ assignment, ...props }: AssignmentActionsProps) {
  const isClient = useIsClient();
  const table = useTableApi();
  const reload = useReload();

  return (
    <div className={'flex items-center justify-end gap-2'}>
      <HideFromClient>
        <AssignmentForm
          value={assignment}
          onSubmit={() => {
            table.reload();
          }}
        >
          <Button variant="outline" size={'sm'}>
            <PencilIcon />
          </Button>
        </AssignmentForm>
      </HideFromClient>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" side={'bottom'} align={'end'}>
          <DropdownMenuLabel className={'flex items-center justify-between gap-2'}>
            <span>Assignment</span> <span>#{assignment.id}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {props.hideDetails ? null : (
              <DropdownMenuItem
                onClick={() => {
                  router.visit(route('assignments.edit', { id: assignment.id }));
                }}
              >
                View Details
                <DropdownMenuShortcut>
                  <Eye />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
            {isClient ? null : (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    toast.message('Generating PDF...');
                    axios
                      .get('/api/v1/assignments/' + assignment.id + '/pdf', { responseType: 'blob' })
                      .then((response) => {
                        download(response);
                        toast.success('PDF generated successfully!');
                      })
                      .catch((error) => {
                        console.error('Error generating PDF:', error);
                        toast.error('Failed to generate PDF.');
                      });
                  }}
                >
                  Assignment Form (PDF)
                  <DropdownMenuShortcut>
                    <ClipboardTypeIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
            {isClient ? null : (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    axios.get('/api/v1/assignments/' + assignment.id + '/link').then((response) => {
                      navigator.clipboard.writeText(response.data['data']);
                      toast.success('Link copied to clipboard!');
                    });
                  }}
                >
                  Copy Link for Inspector
                  <DropdownMenuShortcut>
                    <CopyIcon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={assignment.status === AssignmentStatus.CLOSED}
                  variant={'destructive'}
                  onClick={() => {
                    axios.post('/api/v1/assignments/' + assignment.id + '/close').then(() => {
                      reload();
                    });
                  }}
                >
                  Mark as Closed
                  <DropdownMenuShortcut>
                    <CheckIcon/>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
            {isClient ? null : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Notify Inspector</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        axios.post('/api/v1/assignments/' + assignment.id + '/notify-inspector');
                      }}
                    >
                      Email
                      <DropdownMenuShortcut>
                        <Mail />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      SMS
                      <DropdownMenuShortcut>
                        <MessageSquare />
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
                    <DropdownMenuItem
                      variant={'destructive'}
                      onClick={() => {
                        axios.delete(`/api/v1/assignments/${assignment.id}`).then(() => {
                          router.reload();
                        });
                      }}
                    >
                      Confirm
                      <DropdownMenuShortcut>
                        <Trash2 className={'text-red-500'} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const po_column: ColumnDef<Assignment> = {
  accessorKey: 'purchase_order_id',
  header: 'Work Order',
  cell: ({ row }) => {
    if (!row.original.purchase_order_id) {
      return 'N/A';
    }
    return (
      <Link href={route('purchase-orders.edit', { id: row.original.purchase_order?.id })} className={'underline'}>
        {row.original.purchase_order?.title}
      </Link>
    );
  },
};

interface UseAssignmentsTableOptions {
  project?: Project;
}

export function useAssignmentsTable(options: UseAssignmentsTableOptions = {}) {
  const isInspector = useIsInspector();
  const isClient = useIsClient();

  const columns: ColumnDef<Assignment>[] = [
    // reference_number
    {
      accessorKey: 'reference_number',
      header: 'BIE reference number',
      enableColumnFilter: true,
      cell: ({ row }) => (
        <Link href={route('assignments.edit', { id: row.original.id })} className={'underline'}>
          {row.original.reference_number || `Not set`}
        </Link>
      ),
    },
    // Date recorded
    {
      accessorKey: 'created_at',
      header: 'Date recorded',
      cell: ({ row }) => dayjs(row.original.created_at).format('DD/MM/YYYY'),
    },
    ...(isClient
      ? []
      : ([
          {
            id: 'client_code',
            accessorKey: 'client_code',
            header: () => 'Client Code',
            cell: ({ row }) => {
              return (
                <Link href={route('clients.edit', { id: row.original.project?.client_id })} className={'underline'}>
                  {row.original.project?.client?.code}
                </Link>
              );
            },
          },
          {
            id: 'client_id',
            accessorKey: 'client_id',
            header: 'Client',
            cell: ({ row }) => {
              return (
                <>
                  <Link href={route('clients.edit', { id: row.original.project?.client_id })} className={'underline'}>
                    {row.original.project?.client?.business_name}
                  </Link>
                </>
              );
            },
          },
        ] as ColumnDef<Assignment>[])),
    {
      accessorKey: 'operation_org_id',
      header: 'Operating Office',
      cell: ({ row }) => row.original.operation_org?.name ?? '-',
    },
    {
      id: 'project_id',
      accessorKey: 'project_id',
      header: 'Project',
      cell: ({ row }) => {
        return (
          <>
            <Link href={route('projects.edit', { id: row.original.project_id })} className={'underline'}>
              {row.original.project?.title ?? row.original.project_id}
            </Link>
          </>
        );
      },
    },
    ...(isClient ? [] : [po_column]),
    ...(isInspector
      ? []
      : ([
          {
            accessorKey: 'client_po',
            header: 'Client PO',
            cell: ({ row }) => row.original.client_po ?? '-',
          },
          {
            accessorKey: 'client_po_rev',
            header: 'Client PO Rev',
            cell: ({ row }) => row.original.client_po_rev ?? '-',
          },
        ] as ColumnDef<Assignment>[])),
    {
      accessorKey: 'vendor_id',
      header: 'Vendor',
      cell: ({ row }) => {
        return row.original.vendor?.name ?? '-';
      },
    },
    {
      accessorKey: 'sub_vendor_id',
      header: 'Sub Vendor',
      cell: ({ row }) => {
        return row.original.sub_vendor?.name ?? '-';
      },
    },
    {
      accessorKey: 'skill_id',
      header: 'Equipment Category',
      cell: ({ row }) => row.original.skill?.name ?? '-',
    },
    {
      accessorKey: 'equipment_description',
      header: 'Equipment Description',
      cell: ({ row }) => row.original.equipment ?? '-',
    },
    {
      accessorKey: 'coordinating_office',
      header: 'Coordinating Office',
      cell: ({ row }) => row.original.org?.name ?? '-',
    },
    {
      accessorKey: 'equipment_category',
      header: 'Equipment Category',
      cell: ({ row }) => row.original.equipment_category?.name ?? '-',
    },
    // Notes
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => <div className={'line-clamp-1 max-w-[300px] text-ellipsis'}>{row.original.notes}</div>,
    },
    {
      accessorKey: 'po_delivery_date',
      header: 'PO Delivery Date',
      cell: ({ row }) => (row.original.po_delivery_date ? dayjs(row.original.po_delivery_date).format('DD/MM/YYYY') : '-'),
    },
    ...(isInspector
      ? []
      : ([
          {
            accessorKey: 'budgeted_hours',
            header: 'Budgeted Hours',
            cell: ({ row }) => row.original.purchase_order?.budgeted_hours,
          },
          {
            accessorKey: 'budgeted_travel',
            header: 'Budgeted Travel',
            cell: ({ row }) => `${row.original.purchase_order?.budgeted_travel}${row.original.purchase_order?.travel_unit}`,
          },
          {
            accessorKey: 'final_invoice_date',
            header: 'Final Invoice',
            cell: ({ row }) => (row.original.final_invoice_date ? dayjs(row.original.final_invoice_date).format('DD/MM/YYYY') : '-'),
          },
        ] as ColumnDef<Assignment>[])),
    {
      accessorKey: 'is_closed',
      header: 'Open / Close',
      cell: ({ row }) => <CloseDate close_date={row.original.close_date} />,
    },
    // date closed
    {
      accessorKey: 'date_closed',
      header: 'Date Closed',
      cell: ({ row }) => (row.original.close_date ? dayjs(row.original.close_date).format('DD/MM/YYYY') : '-'),
    },
    // original job number
    {
      accessorKey: 'original_job_number',
      header: 'Original Job Number',
      cell: ({ row }) => row.original.previous_reference_number ?? '-',
    },

    // project type
    {
      accessorKey: 'project_type',
      header: 'Project Type',
      cell: ({ row }) => row.original.project?.project_type?.name ?? '-',
    },

    {
      accessorKey: 'actions',
      id: 'actions',
      enablePinning: true,
      header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
      cell: ({ row }) => {
        return (
          <TableCellWrapper last>
            <AssignmentActions assignment={row.original} />
          </TableCellWrapper>
        );
      },
    },
  ];

  const table = useTable('/api/v1/assignments', {
    selectable: false,
    columns: columns.filter((column) => {
      if (options.project) {
        if (['project_id', 'client_id'].indexOf(column.id || '') !== -1) {
          return false;
        }
      }
      return true;
    }),
    initialState: {
      columnPinning: {
        left: ['reference_number'],
        right: ['actions'],
      },
      pagination: {
        pageSize: 99,
      },
    },
    defaultParams: {
      include: 'project.client,project.project_type,assignment_type,vendor,sub_vendor,operation_org,org,purchase_order,skill',
      sort: 'created_at',
      ...(options.project
        ? {
            'filter[project_id]': String(options.project.id),
          }
        : null),
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') ?? '');
  const debouncer = useDebouncer();

  const project_selector = options.project ? null : (
    <ProjectSelect
      className={'max-w-[150px]'}
      placeholder={'Filter by Project'}
      value={Number(table.searchParams.get('filter[project_id]') ?? null)}
      onValueChane={(value) => {
        table.setSearchParams((params) => {
          if (value) {
            params.set('filter[project_id]', value.toString());
          } else {
            params.delete('filter[project_id]');
          }
          return params;
        });
      }}
    />
  );

  return {
    table,
    content: (
      <div className={'grid grid-cols-1 gap-4'}>
        <DataTable
          table={table}
          left={
            <>
              <Input
                value={keywords}
                onChange={(event) => {
                  setKeywords(event.target.value);
                  debouncer(() => {
                    table.setSearchParams((params) => {
                      params.set('filter[keywords]', event.target.value);
                      return params;
                    });
                  });
                }}
                className={'max-w-[250px]'}
                placeholder={'Search...'}
              />
              {project_selector}
              <>
                {options.project ? null : isClient ? null : (
                  <ClientSelect
                    placeholder={'Filter by Client'}
                    className={'max-w-[150px]'}
                    onValueChane={(value) => {
                      table.setSearchParams((params) => {
                        if (value) {
                          params.set('filter[client_id]', String(value));
                        } else {
                          params.delete('filter[client_id]');
                        }
                        return params;
                      });
                    }}
                    value={Number(table.searchParams.get('filter[client_id]')) || null}
                  />
                )}
              </>
            </>
          }
          right={
            <>
              <ColumnToggle />
            </>
          }
        />
      </div>
    ),
  };
}
