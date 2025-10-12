import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { Card } from '@/components/ui/card';
import { EChartsOption } from 'echarts';

export function MonthlyRevenue() {
  const [option, setOption] = useState<EChartsOption|null>(null);

  useEffect(() => {
    axios.get('/api/v1/reports/monthly-revenue').then(response => {
      setOption({
        tooltip: {
          confine: true,
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          }
        },
        toolbox: {
          padding: [0, 16, 0 ,0],
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          containLabel: true,
          top: 16,
          bottom: 0,
          left: 16,
          right: 16,
        },
        xAxis: {
          type: 'category',
          data: response.data.map((item: any) => item.month),
          splitLine: {
            show: false
          },
        },
        yAxis: {
          type: 'value',
          // format as currency
          axisLabel: {
            formatter: function (value: number) {
              return '$' + value.toFixed(2);
            }
          },
          splitLine: {
            show: false
          },
        },
        series: [
          {
            data: response.data.map((item: any) => item.hour_profit),
            type: 'bar',
            name: 'Hour Profit',
          },
          {
            data: response.data.map((item: any) => item.travel_profit),
            type: 'bar',
            name: 'Travel Profit',
          }
        ]
      });
    })
  }, []);

  if (!option) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <div className={'border-b pb-4 px-4'}>
        <h3 className={'font-bold'}>Monthly Revenue</h3>
        <p className={'text-muted-foreground'}>Monthly gross income except process fee and intercompany commission</p>
      </div>
      <ReactECharts option={option} className={'h-full'} style={{ height: 200 }} />
    </Card>
  );
}
