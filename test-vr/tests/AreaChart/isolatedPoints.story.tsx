import * as React from 'react';
import { Area, AreaChart } from '../../../src';

const gapData = [{ v: 300 }, { v: null }, { v: 500 }, { v: 600 }, { v: null }, { v: 400 }];

export const AreaChartWithNullGaps = () => (
  <AreaChart data={gapData} width={600} height={300} isAnimationActive={false}>
    <Area dataKey="v" isAnimationActive={false} />
  </AreaChart>
);

export const AreaChartWithSingleDatum = () => (
  <AreaChart data={[{ v: 400 }]} width={600} height={300} isAnimationActive={false}>
    <Area dataKey="v" isAnimationActive={false} />
  </AreaChart>
);
