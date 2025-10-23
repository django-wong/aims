import { useTimesheet } from '@/providers/timesheet-provider';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useTableApi } from '@/components/data-table-2';

export function FlashReportSent() {
  const timesheet = useTimesheet();
  const table = useTableApi();

  function update(checked: boolean) {
    axios.put(`/api/v1/timesheets/${timesheet?.id}`, {
      flash_report_sent: checked
    }).then(() => {
      if (table) {
        table.reload();
      } else {
        router.reload();
      }
    })
  }

  return (
    <Switch checked={timesheet?.flash_report_sent ?? false} onCheckedChange={update}/>
  );
}
