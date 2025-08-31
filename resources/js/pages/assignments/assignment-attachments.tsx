import { AttachmentList } from '@/components/attachments/list';
import { useAssignment } from '@/providers/assignment-provider';

interface AssignmentAttachmentsProps {
  allowUpload?: boolean;
}

export function AssignmentAttachments(props: AssignmentAttachmentsProps) {
  const assignment = useAssignment();

  if (!assignment) {
    return null;
  }

  return <div>
    <AttachmentList allowUpload={props.allowUpload} attachable_id={assignment.id} attachable_type={'assignment'} onUploadComplete={() => {}}/>
  </div>;
}
