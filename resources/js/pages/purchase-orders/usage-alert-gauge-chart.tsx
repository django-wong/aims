import EChartsReact from 'echarts-for-react';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';

export function UsageAlertGaugeChart() {
  const po = usePurchaseOrder();
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'],
        radius: '100%',
        min: 0,
        max: 1,
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [(po?.first_alert_threshold ?? 0) / 100, '#47a63e'],
              [(po?.second_alert_threshold ?? 0) / 100, '#ffc776'],
              [(po?.final_alert_threshold ?? 0) / 100, '#fd7272'],
              [1, '#fd7272'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-57%'],
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5,
          },
        },
        // axisLabel: {
        //   color: '#464646',
        //   fontSize: 0,
        //   distance: -40,
        //   rotate: 'tangential',
        //   formatter: function (value: number) {
        //     if (value === 0.875) {
        //       return 'Final Alert';
        //     } else if (value === 0.625) {
        //       return 'Second Alert';
        //     } else if (value === 0.375) {
        //       return 'First Alert';
        //     }
        //     return '';
        //   },
        // },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 20,
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '-35%'],
          valueAnimation: true,
          formatter: function (value: number) {
            return Math.round(value * 100) + '%';
          },
          color: 'inherit',
        },
        data: [
          {
            value: po?.usage,
            name: 'Overall Usage',
          },
        ],
      },
    ],
  };
  return (
    <div className={'bg-muted/40'}><EChartsReact option={option}/></div>
  );
}
