import { AttachmentList } from '@/components/attachments/list';
import { DialogWrapper } from '@/components/dialog-wrapper';

interface Props {
  expense_id: number;
  children: React.ReactNode;
  onUploadComplete?: () => void;
}

export function ExpenseAttachments(props: Props) {
  return (
    <>
      <DialogWrapper trigger={props.children} title={'Flash Report / Receipts etc'} className={'sm:max-w-4xl'}>
        <AttachmentList
          allowUpload={true}
          onUploadComplete={props.onUploadComplete}
          attachable_id={props.expense_id}
          attachable_type={'expense'}
        />
      </DialogWrapper>
    </>
  );
}
