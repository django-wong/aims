import SignaturePad, { SignatureCanvas } from 'react-signature-canvas';
import { useRef } from 'react';
import { useInvoice } from '@/providers/invoice-provider';
import { useTableApi } from '@/components/data-table-2';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { DialogClose } from '@/components/ui/dialog';
import { SizeAwareBuilder } from '@/components/size-aware-builder';
import { DialogWrapper } from '@/components/dialog-wrapper';

export function ApproveForm() {
  const signaturepad = useRef<SignatureCanvas>(null);
  const invoice = useInvoice();
  const table = useTableApi();

  function approve() {
    if (signaturepad.current!.isEmpty()) {
      return;
    }

    axios.post(`/api/v1/invoices/${invoice!.id}/approve`, {
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
    <>
      <DialogWrapper
        trigger={
          <Button variant={'primary'} size={'sm'}><CheckIcon/>Approve</Button>
        }
        title={'Approve the invoice'}
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
    </>
  );
}
