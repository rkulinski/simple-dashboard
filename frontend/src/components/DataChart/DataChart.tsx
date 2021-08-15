import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface DataChartItem extends Record<string, number | string> {
  name: string;
}

interface DataChartProps {
  data: DataChartItem[];
}

export const DataChart = (props: DataChartProps) => {
  const { data = [] } = props;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        {/* TODO we could extract dataKey from the keys of first object */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="impressions"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="clicks"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
