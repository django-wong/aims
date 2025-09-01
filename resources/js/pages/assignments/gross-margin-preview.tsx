import { useEffect, useState } from 'react';
import axios from 'axios';
import { Label } from '@/components/ui/label';

interface GrossMarginPreviewProps {
  purchase_order_id: number;
  assignment_type_id: number;
  user_id: number;
}

export function GrossMarginPreview(props: GrossMarginPreviewProps) {
  const [margins, setMargins] = useState<{
    inspection: number;
    travel: number;
    total: number;
  }|null>(null);

  useEffect(() => {
    setMargins(null);
    if (props.user_id && props.purchase_order_id && props.assignment_type_id) {
      axios.get(`/api/v1/purchase-orders/${props.purchase_order_id}/calculate-gross-margins`, {
        params: {
          assignment_type_id: props.assignment_type_id,
          user_id: props.user_id,
        }
      }).then(response => {
        if (response.data['data']) {
          setMargins(response.data['data']);
        }
      })
    }
  }, [props.purchase_order_id, props.assignment_type_id, props.user_id])

  return (
    <>
      <Label className={'mb-2 font-bold'}>Gross Margin</Label>

      <p>Inspection: {margins?.inspection}%</p>
      <p>Travel: {margins?.travel}%</p>
      <p>Total Gross Margin Profit: {margins?.total}%</p>
    </>
  );
}
