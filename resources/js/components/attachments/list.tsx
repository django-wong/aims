import { usePagedGetApi } from '@/hooks/use-get-api';
import { AttachmentItem } from '@/pages/timesheets/timesheet-items';
import { Attachment } from '@/types';
import { useTable } from '@/hooks/use-table';
import { DataTable } from '@/components/data-table-2';
import { ColumnDef } from '@tanstack/react-table';
import { humanFileSize } from '@/lib/utils';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Badge } from '@/components/ui/badge';

interface AttachmentListProps {
  attachable_id: number;
  attachable_type: string;
}

export function AttachmentList(props: AttachmentListProps) {
  const table = useTable<Attachment>('/api/v1/attachments', {
    selectable: false,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100
      }
    },
    defaultParams: {
      attachable_id: String(props.attachable_id),
      attachable_type: props.attachable_type
    }
  });

  return (
    <DataTable table={table}/>
  )
}


const columns: ColumnDef<Attachment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => {
      const attachment = info.row.original;
      return (
        <a download href={route('attachments.download', { id: attachment.id })} className="text-blue-600 hover:underline">
          {attachment.name}
        </a>
      );
    }
  },
  {
    accessorKey: 'size',
    header: () => (
      <TableCellWrapper last>
        Size
      </TableCellWrapper>
    ),
    size: 120,
    cell: info => (
      <TableCellWrapper last>
        <Badge variant={'secondary'}>
          {humanFileSize(info.getValue() as number)}
        </Badge>
      </TableCellWrapper>
    )
  }
]
