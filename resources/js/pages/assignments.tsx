import AppLayout from '@/layouts/app-layout';
import { Assignment, BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table-2';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EllipsisVertical, Kanban, List, Mail } from 'lucide-react';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AssignmentForm } from '@/pages/assignments/form';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import axios from 'axios';

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
    accessorKey: 'project_id',
    header: 'Project',
    cell: ({ row }) => {
      return <>
        <Link href={route('projects.edit', { id: row.original.project_id })}>
          {row.original.project?.title ?? row.original.project_id}
        </Link>
      </>;
    }
  },
  {
    accessorKey: 'assignment_type_id',
    header: 'Assignment Type',
    cell: ({ row }) => {
      return row.original.assignment_type?.name ?? '-';
    }
  },
  {
    accessorKey: 'client_po',
    header: 'Client PO',
    cell: ({ row }) => {
      return row.original.project?.po_number ?? '-';
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
    accessorKey: 'sub_vendor_id',
    header: 'Sub Vendor',
    cell: ({ row }) => {
      return row.original.sub_vendor?.name ?? '-';
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

export default function Assignments() {
  const table = useTable('/api/v1/assignments', {
    columns: columns,
    defaultParams: {
      'include': 'project,assignment_type,vendor,sub_vendor,operation_org,org',
      'sort': 'created_at',
    }
  });

  const [hash, setHash] = useLocationHash('list');

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') ?? '');
  const debouncer = useDebouncer();
  return (
    <AppLayout breadcrumbs={breadcrumbs} pageAction={<AssignmentForm onSubmit={() => {table.reload()}}><Button>New Assignment</Button></AssignmentForm>}>
      <div className={'px-6'}>
        <div className={'mb-4'}>
          <>
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList>
                <TabsTrigger value={'list'}>
                  <List/>
                </TabsTrigger>
                <TabsTrigger value={'kanban'}>
                  <Kanban/>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </>
        </div>
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
          </>}
        />
      </div>
    </AppLayout>
  );
}


export function AssignmentActions({ assignment }: { assignment: Assignment }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                axios.post('/api/v1/assignments/' + assignment.id + '/notify-inspector');
              }}>
              Notice Inspector
              <DropdownMenuShortcut>
                <Mail/>
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'text-red-500'}
              disabled={true}
              onClick={() => {
                alert('TODO');
                console.log(assignment);
              }}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>View Project</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
