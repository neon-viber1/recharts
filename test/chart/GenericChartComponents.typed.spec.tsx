import React, { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { rechartsTestRender } from '../helper/createSelectorTestCase';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  FunnelChart,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  RadialBarChart,
  ScatterChart,
} from '../../src';

type Point = { value: number; name: string };
const data: ReadonlyArray<Point> = [
  { value: 100, name: 'a' },
  { value: 80, name: 'b' },
];

describe('generic chart components', () => {
  it('should accept a ref on cartesian charts and infer or accept the data type', () => {
    const ref = createRef<SVGSVGElement>();
    rechartsTestRender(
      <>
        <AreaChart<Point> ref={ref} data={data} width={100} height={100}>
          <Area dataKey="value" isAnimationActive={false} />
        </AreaChart>
        <BarChart ref={ref} data={data} width={100} height={100}>
          <Bar dataKey="value" isAnimationActive={false} />
        </BarChart>
        <LineChart ref={ref} data={data} width={100} height={100}>
          <Line dataKey="value" isAnimationActive={false} />
        </LineChart>
        <ComposedChart ref={ref} data={data} width={100} height={100} />
        <FunnelChart ref={ref} data={data} width={100} height={100} />
        <ScatterChart ref={ref} data={data} width={100} height={100} />
      </>,
    );
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('should accept a ref on polar charts', () => {
    const ref = createRef<SVGSVGElement>();
    rechartsTestRender(
      <>
        <PieChart<Point> ref={ref} data={data} width={100} height={100}>
          <Pie dataKey="value" isAnimationActive={false} />
        </PieChart>
        <RadarChart ref={ref} data={data} width={100} height={100} />
        <RadialBarChart ref={ref} data={data} width={100} height={100} />
      </>,
    );
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('should reject a wrong explicit data type and a wrong ref type', () => {
    const wrongRef = createRef<HTMLDivElement>();
    const elements = [
      // @ts-expect-error data does not match explicit generic type
      <LineChart<Point> key="a" data={[{ wrong: 1 }]} width={100} height={100} />,
      // @ts-expect-error ref must be an SVG element ref
      <PieChart key="b" ref={wrongRef} data={data} width={100} height={100} />,
    ];
    expect(elements).toHaveLength(2);
  });
});
