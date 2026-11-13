import React from 'react';
import { describe, expect, it } from 'vitest';
import { Line, LineChart, YAxis } from '../../../src';
import { createSelectorTestCase } from '../../helper/createSelectorTestCase';
import { selectAllYAxes } from '../../../src/state/selectors/selectAllAxes';

const ids = (axes: ReadonlyArray<{ id: string | number }>) => axes.map(a => a.id);

describe('YAxis registration order', () => {
  it.each([[['abc', 'def']], [['def', 'abc']], [[1, 0]], [[0, 1]]])('keeps JSX order for ids %j', order => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <LineChart width={400} height={300} data={[{ a: 1 }]}>
        {order.map(id => (
          <YAxis key={id} yAxisId={id} orientation="left" />
        ))}
        <Line dataKey="a" />
        {children}
      </LineChart>
    ));
    const { spy } = renderTestCase(selectAllYAxes);
    expect(ids(spy.mock.lastCall?.[0] ?? [])).toEqual(order);
  });

  it('keeps position when props change and after remove and re-add goes last', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <LineChart width={400} height={300} data={[{ a: 1 }]}>
        <YAxis yAxisId="z" width={50} />
        <YAxis yAxisId="a" width={60} />
        {children}
      </LineChart>
    ));
    const { spy, rerenderSameComponent } = renderTestCase(selectAllYAxes);
    rerenderSameComponent();
    expect(ids(spy.mock.lastCall?.[0] ?? [])).toEqual(['z', 'a']);
  });
});
