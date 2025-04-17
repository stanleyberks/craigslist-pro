import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';

interface ChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  height?: number;
  className?: string;
}

export const LineChart = ({
  data,
  xDataKey,
  yDataKey,
  height = 300,
  className,
}: ChartProps) => {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yDataKey} stroke="#8884d8" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart = ({
  data,
  xDataKey,
  yDataKey,
  height = 300,
  className,
}: ChartProps) => {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yDataKey} fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
