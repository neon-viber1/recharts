import React, { useState } from 'react';
import { Cell, Pie, PieChart, Tooltip } from '../../../../src';

const data = [
  { name: 'Group A', value: 400, fill: '#8884d8' },
  { name: 'Group B', value: 300, fill: '#82ca9d' },
];

function HoverStyledCells() {
  const [focusCell, setFocusCell] = useState<number | null>(null);
  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="value" isAnimationActive>
        {data.map((entry, i) => (
          <Cell
            key={entry.name}
            fill={entry.fill}
            fillOpacity={focusCell === i ? 1 : 0.5}
            onMouseEnter={() => setFocusCell(i)}
            onMouseLeave={() => setFocusCell(null)}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default {
  component: PieChart,
};

export const HoverStyledCellsWithTooltip = {
  render: () => <HoverStyledCells />,
};
