import { ReplaceFile } from '@/components/attachments/replace-file';
import { UploadForm } from '@/components/attachments/upload-form';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { PopoverConfirm } from '@/components/popover-confirm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTable } from '@/hooks/use-table';
import { humanFileSize } from '@/lib/utils';
import { AttachableProvider } from '@/providers/attachable-provider';
import { AttachmentProvider, useAttachment } from '@/providers/attachment-provider';
import { Attachment } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { CloudUploadIcon, TrashIcon, UploadIcon } from 'lucide-react';

interface AttachmentListProps {
  onUploadComplete?: () => void;
  attachable_id: number;
  attachable_type: string;
  allowUpload?: boolean;
}

export function AttachmentList(props: AttachmentListProps) {
  const outer_table = useTableApi();
  const table = useTable<Attachment>('/api/v1/attachments', {
    selectable: false,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    defaultParams: {
      attachable_id: String(props.attachable_id),
      attachable_type: props.attachable_type,
    },
  });

  function onUploadComplete() {
    table.reload();
    props.onUploadComplete?.();
    outer_table?.reload();
  }

  return (
    <DataTable
      table={table}
      left={<ColumnToggle />}
      right={
        props.allowUpload ? (
          <AttachableProvider value={props}>
            <UploadForm onUploadComplete={onUploadComplete}>
              <Button variant={'outline'}>
                {' '}
                <UploadIcon /> Upload
              </Button>
            </UploadForm>
          </AttachableProvider>
        ) : null
      }
    />
  );
}

const columns: ColumnDef<Attachment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => {
      const attachment = info.row.original;
      return (
        <a download href={route('attachments.download', { id: attachment.id })} className="text-blue-600 hover:underline">
          {attachment.name}
        </a>
      );
    },
  },
  {
    accessorKey: 'size',
    header: () => <TableCellWrapper last>Size</TableCellWrapper>,
    size: 120,
    cell: (info) => (
      <TableCellWrapper last>
        <Badge variant={'secondary'}>{humanFileSize(info.getValue() as number)}</Badge>
      </TableCellWrapper>
    ),
  },
  {
    accessorKey: 'actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({ row }) => (
      <AttachmentProvider value={row.original}>
        <TableCellWrapper last className={'flex justify-end gap-2'}>
          <AttachmentActions />
        </TableCellWrapper>
      </AttachmentProvider>
    ),
  },
];

export function AttachmentActions() {
  const attachment = useAttachment();
  const table = useTableApi();

  if (!attachment) {
    return null;
  }

  return (
    <>
      <ReplaceFile value={attachment} asChild>
        <Button variant={'outline'} size={'sm'}>
          <CloudUploadIcon />
        </Button>
      </ReplaceFile>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure to delete this file?'}
        onConfirm={() => {
          axios.delete('/api/v1/attachments/' + attachment.id).then(() => {
            table?.reload();
          });
        }}
        asChild
      >
        <Button variant={'destructive'} size={'sm'}>
          <TrashIcon />
        </Button>
      </PopoverConfirm>
    </>
  );
}
