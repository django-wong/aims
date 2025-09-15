import { useTableApi } from '@/components/data-table-2';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { SizeAwareBuilder } from '@/components/size-aware-builder';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { RejectButton } from '@/pages/timesheets/reject-button';
import { useAssignment } from '@/providers/assignment-provider';
import { useTimesheet } from '@/providers/timesheet-provider';
import { Role, TimesheetStatus } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { CheckIcon } from 'lucide-react';
import { useRef } from 'react';
import SignaturePad, { SignatureCanvas } from 'react-signature-canvas';

export function ContractorHolderApprove() {
  const assignment = useAssignment();
  const timesheet = useTimesheet();

  const role = useRole();
  const auth = useAuth();

  if ([Role.Admin, Role.Staff, Role.PM].indexOf(role ?? -1) === -1) {
    return null;
  }

  if (assignment?.org_id !== auth.org?.id) {
    return null;
  }

  if (timesheet?.status !== TimesheetStatus.Reviewing) {
    return null;
  }

  return (
    <>
      <ApproveTimesheetForm/>
      <RejectButton />
    </>
  );
}

export function ApproveTimesheetForm() {
  const signaturepad = useRef<SignatureCanvas>(null);
  const timesheet = useTimesheet();
  const table = useTableApi();
  function approve() {
    if (signaturepad.current!.isEmpty()) {
      return;
    }

    axios.post(`/api/v1/timesheets/${timesheet!.id}/approve`, {
      signature_base64: signaturepad.current?.toDataURL(),
    }).then(() => {
      if (table) {
        table.reload();
      } else {
        router.reload();
      }
    });
  }

  return (
    <DialogWrapper
      trigger={
        <Button variant={'primary'} size={'sm'} className={'contractor-holder-approve-button'}>
          <CheckIcon />
          Approve
        </Button>
      }
      title={'Approve the timesheet'}
      description={'Please sign in the space bellow'}
      footer={
        <>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button onClick={approve}>Approve</Button>
        </>
      }
    >
      <div className={'bg-muted rounded-md -m-6'}>
        <SizeAwareBuilder className={'aspect-video w-full'} builder={(size) => <SignaturePad ref={signaturepad} canvasProps={{ ...size }} />} />
      </div>
    </DialogWrapper>
  );
}
