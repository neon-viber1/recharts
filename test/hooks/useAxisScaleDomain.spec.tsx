import React from 'react';
import { describe, it, expect } from 'vitest';
import { createSelectorTestCase } from '../helper/createSelectorTestCase';
import { Line, LineChart, XAxis, YAxis } from '../../src';
import { useXAxisDomain, useXAxisScaleDomain, useYAxisDomain, useYAxisScaleDomain } from '../../src/hooks';
import { expectLastCalledWith } from '../helper/expectLastCalledWith';

const dataWithNegative = [
  { name: 'Page A', pv: -200 },
  { name: 'Page B', pv: 4567 },
  { name: 'Page D', pv: 9800 },
];
const dataPositive = dataWithNegative.slice(1);

function render(data: ReadonlyArray<unknown>, yAxisProps: Record<string, unknown> = {}) {
  return createSelectorTestCase(({ children }) => (
    <LineChart width={500} height={300} data={data}>
      <Line dataKey="pv" />
      <XAxis dataKey="name" />
      <YAxis {...yAxisProps} />
      {children}
    </LineChart>
  ));
}

function useYScaleDomainA() {
  return useYAxisScaleDomain('a');
}
function useYScaleDomainB() {
  return useYAxisScaleDomain('b');
}
function useYScaleDomainNope() {
  return useYAxisScaleDomain('nope');
}

describe('axis scale domain hooks', () => {
  it('useYAxisDomain keeps the data domain while useYAxisScaleDomain returns the nice domain', () => {
    const renderTestCase = render(dataWithNegative);
    const domain = renderTestCase(useYAxisDomain);
    expectLastCalledWith(domain.spy, [-200, 9800]);
    const scaleDomain = renderTestCase(useYAxisScaleDomain);
    expectLastCalledWith(scaleDomain.spy, [-3500, 10500]);
  });

  it('returns [0, 10000] without the negative datapoint', () => {
    const renderTestCase = render(dataPositive);
    expectLastCalledWith(renderTestCase(useYAxisDomain).spy, [0, 9800]);
    expectLastCalledWith(renderTestCase(useYAxisScaleDomain).spy, [0, 10000]);
  });

  it('respects a fixed numeric domain', () => {
    const renderTestCase = render(dataPositive, { domain: [0, 12000] });
    expectLastCalledWith(renderTestCase(useYAxisScaleDomain).spy, [0, 12000]);
  });

  it('respects a function domain', () => {
    const renderTestCase = render(dataPositive, { domain: ([, max]: [number, number]) => [0, max + 1000] });
    const result = renderTestCase(useYAxisScaleDomain).spy.mock.calls.at(-1)?.[0];
    expect(result?.[0]).toBe(0);
    expect(Number(result?.[1])).toBeGreaterThanOrEqual(10800);
  });

  it('respects auto domain', () => {
    const renderTestCase = render(dataWithNegative, { domain: ['auto', 'auto'] });
    const result = renderTestCase(useYAxisScaleDomain).spy.mock.calls.at(-1)?.[0];
    expect(result?.[0]).toBeLessThanOrEqual(-200);
    expect(Number(result?.[1])).toBeGreaterThanOrEqual(9800);
  });

  it('respects allowDataOverflow with a fixed domain', () => {
    const renderTestCase = render(dataWithNegative, { domain: [0, 5000], allowDataOverflow: true });
    expectLastCalledWith(renderTestCase(useYAxisScaleDomain).spy, [0, 5000]);
  });

  it('scale domain extent matches the tick extent when nice ticks apply', () => {
    const renderTestCase = render(dataWithNegative);
    const result = renderTestCase(useYAxisScaleDomain).spy.mock.calls.at(-1)?.[0];
    expect(result).toEqual([-3500, 10500]);
  });

  it('returns categorical domain for a category X axis', () => {
    const renderTestCase = render(dataWithNegative);
    const names = ['Page A', 'Page B', 'Page D'];
    expectLastCalledWith(renderTestCase(useXAxisDomain).spy, names);
    expectLastCalledWith(renderTestCase(useXAxisScaleDomain).spy, names);
  });

  it('supports multiple axis ids', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <LineChart width={500} height={300} data={dataWithNegative}>
        <Line dataKey="pv" yAxisId="a" />
        <Line dataKey="pv" yAxisId="b" />
        <YAxis yAxisId="a" />
        <YAxis yAxisId="b" domain={[0, 1000]} allowDataOverflow />
        {children}
      </LineChart>
    ));
    expectLastCalledWith(renderTestCase(useYScaleDomainA).spy, [-3500, 10500]);
    expectLastCalledWith(renderTestCase(useYScaleDomainB).spy, [0, 1000]);
  });

  it('returns undefined for a non-existent axis id', () => {
    const renderTestCase = render(dataWithNegative);
    expectLastCalledWith(renderTestCase(useYScaleDomainNope).spy, undefined);
  });

  it('returns a stable reference between renders', () => {
    const renderTestCase = render(dataWithNegative);
    const { spy } = renderTestCase(useYAxisScaleDomain);
    const calls = spy.mock.calls.map(c => c[0]).filter(Boolean);
    expect(new Set(calls).size).toBe(1);
  });
});
