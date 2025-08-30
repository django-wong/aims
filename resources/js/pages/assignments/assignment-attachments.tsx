import { AttachmentList } from '@/components/attachments/list';
import { useAssignment } from '@/providers/assignment-provider';

export function AssignmentAttachments() {
  const assignment = useAssignment();

  if (!assignment) {
    return null;
  }

  return <div>
    <AttachmentList attachable_id={assignment.id} attachable_type={'assignment'}/>
  </div>;
}
