import React from 'react';
import { describe, expect, it } from 'vitest';
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from '../../src';
import { getIsolatedAreaPoints } from '../../src/cartesian/getIsolatedAreaPoints';
import { rechartsTestRender } from '../helper/createSelectorTestCase';

describe('getIsolatedAreaPoints', () => {
  const pts = [
    { x: 0, y: 10 },
    { x: 10, y: null },
    { x: 20, y: 30 },
    { x: 30, y: 40 },
    { x: 40, y: null },
    { x: 50, y: 5 },
  ];

  it('returns stems for isolated points only in horizontal layout', () => {
    expect(getIsolatedAreaPoints(pts, 100, 'horizontal', false)).toEqual([
      { index: 0, x1: 0, y1: 100, x2: 0, y2: 10 },
      { index: 5, x1: 50, y1: 100, x2: 50, y2: 5 },
    ]);
  });

  it('uses x as baseline in vertical layout', () => {
    expect(getIsolatedAreaPoints([{ x: 7, y: 3 }], 50, 'vertical', false)).toEqual([
      { index: 0, x1: 50, y1: 3, x2: 7, y2: 3 },
    ]);
  });

  it('uses per-point baseline for stacked and ranged areas', () => {
    const base = [{ x: 0, y: 60 }];
    expect(getIsolatedAreaPoints([{ x: 0, y: 10 }], base, 'horizontal', false)).toEqual([
      { index: 0, x1: 0, y1: 60, x2: 0, y2: 10 },
    ]);
    expect(getIsolatedAreaPoints([{ x: 0, y: 10 }], [{ x: 0, y: null }], 'horizontal', false)).toEqual([]);
  });

  it('with connectNulls only a lone point is isolated', () => {
    expect(getIsolatedAreaPoints(pts, 100, 'horizontal', true)).toEqual([]);
    expect(
      getIsolatedAreaPoints(
        [
          { x: 0, y: null },
          { x: 1, y: 2 },
        ],
        9,
        'horizontal',
        true,
      ),
    ).toHaveLength(1);
  });

  it('handles empty input', () => {
    expect(getIsolatedAreaPoints(undefined, 0, 'horizontal', false)).toEqual([]);
    expect(getIsolatedAreaPoints([], 0, 'horizontal', false)).toEqual([]);
  });
});

const data = [{ a: 5 }, { a: null }, { a: 8 }, { a: 9 }, { a: null }, { a: 3 }];

describe('Area isolated points rendering', () => {
  it('renders a stem for each isolated point in a horizontal chart', () => {
    const { container } = rechartsTestRender(
      <AreaChart width={300} height={200} data={data}>
        <Area dataKey="a" stroke="red" isAnimationActive={false} />
      </AreaChart>,
    );
    const stems = container.querySelectorAll('.recharts-area-isolated-point');
    expect(stems).toHaveLength(2);
    stems.forEach(s => {
      expect(s.getAttribute('x1')).toBe(s.getAttribute('x2'));
      expect(s.getAttribute('y1')).not.toBe(s.getAttribute('y2'));
      expect(s.getAttribute('stroke')).toBe('red');
    });
  });

  it('renders a stem for a single data point', () => {
    const { container } = rechartsTestRender(
      <AreaChart width={300} height={200} data={[{ a: 5 }]}>
        <Area dataKey="a" isAnimationActive={false} />
      </AreaChart>,
    );
    expect(container.querySelectorAll('.recharts-area-isolated-point')).toHaveLength(1);
  });

  it('renders stems in a vertical chart', () => {
    const { container } = rechartsTestRender(
      <AreaChart width={300} height={200} data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis type="category" dataKey="a" />
        <Area dataKey="a" isAnimationActive={false} />
      </AreaChart>,
    );
    const stems = container.querySelectorAll('.recharts-area-isolated-point');
    expect(stems).toHaveLength(2);
    stems.forEach(s => expect(s.getAttribute('y1')).toBe(s.getAttribute('y2')));
  });

  it('renders stems for stacked areas using the lower series as baseline', () => {
    const { container } = rechartsTestRender(
      <AreaChart width={300} height={200} data={[{ a: 5, b: 2 }]}>
        <Area dataKey="a" stackId="1" isAnimationActive={false} />
        <Area dataKey="b" stackId="1" isAnimationActive={false} />
      </AreaChart>,
    );
    const stems = container.querySelectorAll('.recharts-area-isolated-point');
    expect(stems).toHaveLength(2);
    expect(stems[0].getAttribute('y1')).not.toBe(stems[1].getAttribute('y1'));
  });

  it('draws no stems with connectNulls or contiguous points', () => {
    const a = rechartsTestRender(
      <AreaChart width={300} height={200} data={data}>
        <Area dataKey="a" connectNulls isAnimationActive={false} />
      </AreaChart>,
    );
    expect(a.container.querySelectorAll('.recharts-area-isolated-point')).toHaveLength(0);
    const b = rechartsTestRender(
      <AreaChart width={300} height={200} data={[{ a: 1 }, { a: 2 }]}>
        <Area dataKey="a" isAnimationActive={false} />
      </AreaChart>,
    );
    expect(b.container.querySelectorAll('.recharts-area-isolated-point')).toHaveLength(0);
  });
});

describe('Bar isolated points', () => {
  it('renders a rectangle for an isolated point and for a single datum', () => {
    const { container } = rechartsTestRender(
      <BarChart width={300} height={200} data={data}>
        <Bar dataKey="a" isAnimationActive={false} />
      </BarChart>,
    );
    expect(container.querySelectorAll('.recharts-bar-rectangle path')).toHaveLength(4);
    const single = rechartsTestRender(
      <BarChart width={300} height={200} data={[{ a: 5 }]}>
        <Bar dataKey="a" isAnimationActive={false} />
      </BarChart>,
    );
    expect(single.container.querySelectorAll('.recharts-bar-rectangle path')).toHaveLength(1);
  });
});
