import { Attachment } from '@/types';
import { useTable } from '@/hooks/use-table';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { ColumnDef } from '@tanstack/react-table';
import { humanFileSize } from '@/lib/utils';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AttachableProvider } from '@/providers/attachable-provider';
import { UploadForm } from '@/components/attachments/upload-form';
import { CloudUploadIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AttachmentListProps {
  onUploadComplete?: () => void;
  attachable_id: number;
  attachable_type: string;
  allowUpload?: boolean;
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

  function onUploadComplete() {
    table.reload();
    props.onUploadComplete?.();
  }

  return (
    <DataTable
      table={table}
      left={
        <ColumnToggle/>
      }
      right={
        props.allowUpload ? (
          <AttachableProvider value={props}>
            <UploadForm onUploadComplete={onUploadComplete}>
              <Button variant={'outline'}> <UploadIcon/> Upload</Button>
            </UploadForm>
          </AttachableProvider>
        ) : null
      }
    />
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
  },
  {
    accessorKey: 'actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: () => (
      <TableCellWrapper last className={'flex gap-2 justify-end'}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'outline'} size={'sm'}>
              <CloudUploadIcon/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Upload a replacement file
          </TooltipContent>
        </Tooltip>
        <Button variant={'destructive'} size={'sm'}><TrashIcon/></Button>
      </TableCellWrapper>
    )
  }
]

