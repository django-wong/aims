import AppLayout from '@/layouts/app-layout';
import { Assignment, BreadcrumbItem, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { EllipsisVertical, Eye, Mail, MessageSquare, PlusIcon, Trash2, User } from 'lucide-react';
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

const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: 'inspector_id',
    header: () => (
      <>
        <div className={'flex items-center gap-1'}>
          <User className={'size-4'}/>
          Assignee
        </div>
      </>
    ),
    cell: ({ row }) => (
      <Link href={route('assignments.edit', { id: row.original.id})} className={'underline'}>
        {row.original.inspector?.name ?? 'N/A'}
      </Link>
    )
  },
  {
    accessorKey: 'assignment_type_id',
    header: 'Type',
    cell: ({ row }) => {
      return <Badge variant={'secondary'}>{row.original.assignment_type?.name ?? '-'}</Badge>;
    },
    size: 100,
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
  {
    accessorKey: 'po',
    header: 'PO',
    cell: ({ row }) => {
      return (
        <Link href={route('purchase-orders.edit', { id: row.original.purchase_order?.id })} className={'underline'}>
          {row.original.purchase_order?.title}
        </Link>
      );
    }
  },
  {
    accessorKey: 'vendor_id',
    header: 'Vendor',
    cell: ({ row }) => {
      return row.original.vendor?.name ?? '-';
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <>
          <AssignmentActions assignment={row.original}/>
        </>
      );
    }
  }
];

export default function AssignmentsPage() {
  const {table, content} = useAssignmentsTable();
  const [count, setCount] = useState(0);

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <AssignmentForm
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
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side={'bottom'} align={'end'}>
          <DropdownMenuLabel className={'flex items-center gap-2 justify-between'}>
            <span>Assignment</span> <span>#{assignment.id}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
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
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Send notification via...</DropdownMenuSubTrigger>
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

interface UseAssignmentsTableOptions {
  project?: Project
}

export function useAssignmentsTable(options: UseAssignmentsTableOptions = {}) {
  const table = useTable('/api/v1/assignments', {
    columns: columns.filter((column) => {
      if (options.project) {
        if (column.id === 'project_id') {
          return false;
        }
      }
      return true;
    }),
    defaultParams: {
      'include': 'project,assignment_type,vendor,sub_vendor,operation_org,org,inspector,purchase_order',
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
          console.info('change value to:', value);
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
              Project: <Badge>{project?.title ?? 'All'}</Badge>
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
