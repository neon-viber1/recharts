import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Line, LineChart, YAxis } from '../../../src';
import { mockGetBoundingClientRect } from '../../helper/mockGetBoundingClientRect';

type Datum = { name: string; uv: number };

const data: ReadonlyArray<Datum> = [
  { name: 'a', uv: 4000 },
  { name: 'b', uv: 3000 },
  { name: 'c', uv: 2000 },
];

const empty: ReadonlyArray<Datum> = [];

function Chart({ chartData, orientation }: { chartData: ReadonlyArray<Datum>; orientation: 'left' | 'right' }) {
  return (
    <LineChart width={500} height={300}>
      <Line data={chartData} dataKey="uv" isAnimationActive={false} />
      <YAxis width="auto" orientation={orientation} />
    </LineChart>
  );
}

function axisLineWidth(container: HTMLElement): number {
  const line = container.querySelector('.recharts-yAxis .recharts-cartesian-axis-line');
  return Number(line?.getAttribute('width'));
}

function tickCount(container: HTMLElement): number {
  return container.querySelectorAll('.recharts-yAxis .recharts-cartesian-axis-tick').length;
}

describe('YAxis width="auto" with changing data', () => {
  it.each(['left', 'right'] as const)('computes width after empty -> data (%s)', orientation => {
    mockGetBoundingClientRect({ width: 80, height: 30 });
    const { container, rerender } = render(<Chart chartData={empty} orientation={orientation} />);
    rerender(<Chart chartData={data} orientation={orientation} />);
    expect(tickCount(container)).toBeGreaterThan(0);
    expect(axisLineWidth(container)).toBe(88);
  });

  it('recomputes width after data -> empty -> data', () => {
    mockGetBoundingClientRect({ width: 80, height: 30 });
    const { container, rerender } = render(<Chart chartData={data} orientation="left" />);
    expect(axisLineWidth(container)).toBe(88);
    rerender(<Chart chartData={empty} orientation="left" />);
    rerender(<Chart chartData={data} orientation="left" />);
    expect(tickCount(container)).toBeGreaterThan(0);
    expect(axisLineWidth(container)).toBe(88);
  });
});
