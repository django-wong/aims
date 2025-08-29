import { useTimesheetItem } from '@/providers/timesheet-item-provider';
import { AttachmentList } from '@/components/attachments/list';
import { PropsWithChildren } from 'react';
import { DialogWrapper } from '@/components/dialog-wrapper';

export function TimesheetItemAttachments(props: PropsWithChildren) {
  const timesheet_item = useTimesheetItem();

  return (
    <DialogWrapper trigger={props.children} title={'Flash Report / Receipts etc'} className={'sm:max-w-4xl'}>
      <AttachmentList attachable_id={timesheet_item.id} attachable_type={'timesheet_item'}/>
    </DialogWrapper>
  )
}
