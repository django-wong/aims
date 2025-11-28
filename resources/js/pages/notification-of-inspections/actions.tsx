import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useReload } from '@/hooks/use-reload';
import { useNotificationOfInspection } from '@/providers/notification-of-inspection-provider';
import { NotificationOfInspectionForm } from '@/pages/assignments/notification-of-inspection-form';
import { useClient } from '@/providers/client-provider';
import { useIsClient } from '@/hooks/use-role';

export function NotificationOfInspectionActions() {
  const notification_of_inspection = useNotificationOfInspection();
  const reload = useReload();
  const isClient = useIsClient();

  if (!notification_of_inspection) {
    return null;
  }

  function handleDelete() {
    axios.delete(`/api/v1/notification-of-inspections/${notification_of_inspection!.id}`).then(reload);
  }

  return (
    <div className={'flex justify-end gap-2'}>
      <PopoverConfirm message={'Are you sure to delete this notification of inspection?'} onConfirm={handleDelete} asChild>
        <Button size={'sm'} variant={'destructive'}>
          <Trash2Icon/>
        </Button>
      </PopoverConfirm>
      {
        isClient ? (
          <NotificationOfInspectionForm value={notification_of_inspection}>
            <Button size={'sm'} variant={'outline'}>
              <PencilIcon/>
            </Button>
          </NotificationOfInspectionForm>
        ) : null
      }
    </div>
  );
}
