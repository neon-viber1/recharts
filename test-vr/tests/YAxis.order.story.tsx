import * as React from 'react';
import { Line, LineChart, XAxis, YAxis } from '../../src';

const data = [
  { name: 'A', uv: 400, pv: 2400 },
  { name: 'B', uv: 300, pv: 4567 },
  { name: 'C', uv: 300, pv: 1398 },
];

export const AlphabeticalOrder = () => (
  <LineChart width={500} height={300} data={data}>
    <XAxis dataKey="name" />
    <YAxis yAxisId="abc" orientation="left" stroke="#8884d8" />
    <YAxis yAxisId="def" orientation="left" stroke="#82ca9d" />
    <Line yAxisId="abc" dataKey="uv" stroke="#8884d8" isAnimationActive={false} />
    <Line yAxisId="def" dataKey="pv" stroke="#82ca9d" isAnimationActive={false} />
  </LineChart>
);

export const ReverseAlphabeticalOrder = () => (
  <LineChart width={500} height={300} data={data}>
    <XAxis dataKey="name" />
    <YAxis yAxisId="def" orientation="left" stroke="#82ca9d" />
    <YAxis yAxisId="abc" orientation="left" stroke="#8884d8" />
    <Line yAxisId="abc" dataKey="uv" stroke="#8884d8" isAnimationActive={false} />
    <Line yAxisId="def" dataKey="pv" stroke="#82ca9d" isAnimationActive={false} />
  </LineChart>
);
