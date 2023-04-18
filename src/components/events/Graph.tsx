import React, { useEffect, useMemo, useRef } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Filler, Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { OrderReport } from '../../models/models';
import { getRelativePosition } from 'chart.js/helpers';
import { formatSeconds } from './OrderDetails';

ChartJS.register(LinearScale, LineElement, Tooltip, PointElement, Filler);

interface Point {
  x: number;
  y: number;
}

const buildPoints = (report: OrderReport): Point[] => {
  let counter = 0;
  const result = [{ x: 0, y: 0 }];

  for (let i = 0; i < report.adSeconds.length; i++) {
    if (report.adSeconds[i]) {
      counter++;
    }
    result.push({ x: i + 1, y: counter });
  }
  return result;
};

// @ts-ignore
const options = {
  type: 'line',
  events: ['click'],
  responsive: true,
  scales: {
    y: {
      grid: {
        drawBorder: false,
        lineWidth: 0.5
      },
      type: 'linear'
    },
    x: {
      type: 'linear'
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: false,
      callbacks: {
        title: (context: unknown) => {
          // @ts-ignore
          return formatSeconds(context[0].parsed.x);
        },
        label: (context: unknown) => {
          // @ts-ignore
          return `${context.parsed.y} AD seconds`;
        }
      }
    }
  }
};

const data = (report: OrderReport) => {
  const pointData = buildPoints(report);
  return {
    labels: pointData.map(it => it.x),
    datasets: [{ fill: { value: 0 }, data: pointData, backgroundColor: 'rgba(25, 118, 210, 0.2)', borderColor: '#1976d2' }]
  };
};

type GraphProps = {
  report: OrderReport;
  currentPosition: number;
  onSeek: (pos: number) => void;
};

export const Graph = ({ report, currentPosition, onSeek }: GraphProps) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current != null) {
      const chart = chartRef.current!! as Chart;
      const xCoordinate = chart.scales.x.getPixelForValue(currentPosition);
      chart.render();
      chart.ctx.save();
      chart.ctx.beginPath();
      chart.ctx.moveTo(xCoordinate, chart.scales.y.top);
      chart.ctx.lineTo(xCoordinate, chart.scales.y.bottom);
      chart.ctx.lineWidth = 1;
      chart.ctx.strokeStyle = '#757575';
      chart.ctx.stroke();
      chart.ctx.restore();
    }
  }, [currentPosition]);

  // @ts-ignore
  const onClick = event => {
    const relativePosition = getRelativePosition(event, chartRef.current!!);
    // @ts-ignore
    onSeek(chartRef.current!!.scales.x.getValueForPixel(relativePosition.x));
  };

  const line = useMemo(() => {
    // @ts-ignore
    return <Line ref={chartRef} options={options} data={data(report)} onClick={onClick} />;
  }, []);

  if (report == null) return null;

  return line;
};
