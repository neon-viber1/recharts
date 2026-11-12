import React from 'react';
import { beforeEach, describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from '../../src';
import { lineChartMouseHoverTooltipSelector } from '../component/Tooltip/tooltipMouseHoverSelectors';
import { expectTooltipPayload, showTooltipOnCoordinate } from '../component/Tooltip/tooltipTestHelpers';
import { mockGetBoundingClientRect } from '../helper/mockGetBoundingClientRect';

const data = [
  { day: '2024-01-01', value: 0 },
  { day: '2024-01-01', value: 13 },
  { day: '2024-01-02', value: 5 },
];

describe('LineChart tooltip with rows sharing the same category', () => {
  beforeEach(() => {
    mockGetBoundingClientRect({ width: 100, height: 100 });
  });

  it('shows the value of the hovered row, not of the first row with the same category', () => {
    const { container } = render(
      <LineChart width={400} height={300} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis dataKey="day" />
        <YAxis width={0} />
        <Line dataKey="value" isAnimationActive={false} />
        <Tooltip />
      </LineChart>,
    );
    // ticks are at x = 0, 200, 400; the second row is hovered
    showTooltipOnCoordinate(container, lineChartMouseHoverTooltipSelector, { clientX: 200, clientY: 100 });
    expectTooltipPayload(container, '2024-01-01', ['value : 13']);
  });

  it('shows the first row when it is hovered', () => {
    const { container } = render(
      <LineChart width={400} height={300} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis dataKey="day" />
        <YAxis width={0} />
        <Line dataKey="value" isAnimationActive={false} />
        <Tooltip />
      </LineChart>,
    );
    showTooltipOnCoordinate(container, lineChartMouseHoverTooltipSelector, { clientX: 0, clientY: 100 });
    expectTooltipPayload(container, '2024-01-01', ['value : 0']);
  });

  it('keeps unique categories working with allowDuplicatedCategory=false', () => {
    const { container } = render(
      <LineChart width={400} height={300} data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis dataKey="day" allowDuplicatedCategory={false} />
        <YAxis width={0} />
        <Line dataKey="value" isAnimationActive={false} />
        <Tooltip />
      </LineChart>,
    );
    showTooltipOnCoordinate(container, lineChartMouseHoverTooltipSelector, { clientX: 400, clientY: 100 });
    expectTooltipPayload(container, '2024-01-02', ['value : 5']);
  });
});
