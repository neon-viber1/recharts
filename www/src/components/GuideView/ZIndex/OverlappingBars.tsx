import { Bar, BarChart, Legend, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

// #region Sample data
const data = [
  { month: 'Jan', target: 4000, actual: 2400 },
  { month: 'Feb', target: 3000, actual: 1398 },
  { month: 'Mar', target: 5000, actual: 4800 },
  { month: 'Apr', target: 2780, actual: 3908 },
  { month: 'May', target: 1890, actual: 1200 },
];
// #endregion

const chartStyle = { width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 };

const OverlappingBars = () => {
  return (
    <BarChart style={chartStyle} responsive data={data}>
      <XAxis xAxisId="primary" dataKey="month" />
      {/* A hidden second axis gives the second Bar its own band, so it overlaps the first one */}
      <XAxis xAxisId="secondary" dataKey="month" hide />
      <YAxis width="auto" />
      <Legend />
      <Bar xAxisId="primary" dataKey="target" fill="#8884d8" barSize={50} zIndex={1} />
      <Bar xAxisId="secondary" dataKey="actual" fill="#82ca9d" barSize={25} zIndex={2} />
      <RechartsDevtools />
    </BarChart>
  );
};

export default OverlappingBars;
