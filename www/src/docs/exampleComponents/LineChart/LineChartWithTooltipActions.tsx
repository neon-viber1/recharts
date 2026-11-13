import { CartesianGrid, Line, LineChart, Tooltip, useTooltipActions, XAxis, YAxis } from 'recharts';
import { generateMockData, MockDataType, RechartsDevtools } from '@recharts/devtools';

const data: Array<MockDataType> = generateMockData(6, 26213);

const chartStyle = { width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 };
const chartMargin = { top: 35, right: 0, left: 0, bottom: 5 };

function TooltipButtons() {
  const { hideTooltip, showTooltip } = useTooltipActions();
  return (
    <foreignObject x={60} y={0} width={320} height={30}>
      <button type="button" onClick={() => showTooltip(2)}>
        Show index 2
      </button>
      <button type="button" onClick={hideTooltip}>
        Hide tooltip
      </button>
    </foreignObject>
  );
}

export default function Example() {
  return (
    <LineChart style={chartStyle} responsive data={data} margin={chartMargin}>
      <CartesianGrid />
      <XAxis dataKey="label" />
      <YAxis width="auto" />
      <Tooltip />
      <Line dataKey="x" />
      <TooltipButtons />
      <RechartsDevtools />
    </LineChart>
  );
}
