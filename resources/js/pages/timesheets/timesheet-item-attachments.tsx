import { useTimesheetItem } from '@/providers/timesheet-item-provider';
import { AttachmentList } from '@/components/attachments/list';
import { DialogWrapper } from '@/components/dialog-wrapper';

interface Props {
  children: React.ReactNode;
  onUploadComplete?: () => void;
}

export function TimesheetItemAttachments(props: Props) {
  const timesheet_item = useTimesheetItem();

  if (!timesheet_item) {
    return null;
  }

  return (
    <DialogWrapper trigger={props.children} title={'Flash Report / Receipts etc'} className={'sm:max-w-4xl'}>
      <AttachmentList
        allowUpload={true}
        onUploadComplete={props.onUploadComplete}
        attachable_id={timesheet_item.id}
        attachable_type={'timesheet_item'}
      />
    </DialogWrapper>
  )
}
