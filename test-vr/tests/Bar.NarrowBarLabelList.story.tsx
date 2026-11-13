/**
 * @fileOverview Labels on narrow bars in a horizontal BarChart should use the room of the category band
 * and not wrap at the width of the bar.
 */
import * as React from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from '../../src';

const data = [
  { name: 'Page A', label: 'First page label', uv: 400 },
  { name: 'Page B', label: 'Second page label', uv: 300 },
  { name: 'Page C', label: 'Third page label', uv: 200 },
  { name: 'Page D', label: 'Fourth page label', uv: 278 },
  { name: 'Page E', label: 'Fifth page label', uv: 189 },
];

export const LabelListTop = () => (
  <BarChart width={700} height={300} data={data} margin={{ top: 30 }}>
    <XAxis dataKey="name" />
    <YAxis />
    <Bar dataKey="uv" barSize={20} isAnimationActive={false}>
      <LabelList dataKey="label" position="top" />
    </Bar>
  </BarChart>
);

export const LabelListInsideBottom = () => (
  <BarChart width={700} height={300} data={data} margin={{ top: 30 }}>
    <XAxis dataKey="name" />
    <YAxis />
    <Bar dataKey="uv" barSize={20} isAnimationActive={false}>
      <LabelList dataKey="label" position="insideBottom" />
    </Bar>
  </BarChart>
);
