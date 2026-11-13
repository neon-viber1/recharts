import React, { ReactNode } from 'react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Tooltip, TooltipContentProps } from '../../../src';
import { assertNotNull } from '../../helper/assertNotNull';
import { PageData } from '../../_data';
import { createSelectorTestCase } from '../../helper/createSelectorTestCase';
import { mockGetBoundingClientRect } from '../../helper/mockGetBoundingClientRect';
import { showTooltip } from './tooltipTestHelpers';
import {
  barChartItemMouseHoverTooltipSelector,
  barChartMouseHoverTooltipSelector,
  pieChartMouseHoverTooltipSelector,
} from './tooltipMouseHoverSelectors';

function lastProps(spy: Mock<(props: TooltipContentProps) => ReactNode>): TooltipContentProps {
  const call = spy.mock.calls.at(-1);
  if (call == null) {
    throw new Error('content was not called');
  }
  return call[0];
}

describe('Tooltip content activeDataKey and activeGraphicalItemId', () => {
  const spy: Mock<(props: TooltipContentProps) => ReactNode> = vi.fn();

  beforeEach(() => {
    mockGetBoundingClientRect({ width: 100, height: 100 });
    spy.mockClear();
  });

  it('should be undefined when the tooltip is inactive', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <BarChart width={400} height={400} data={PageData}>
        <Bar dataKey="uv" id="bar-uv" />
        <Tooltip content={spy} />
        {children}
      </BarChart>
    ));
    renderTestCase();
    expect(lastProps(spy).active).toBe(false);
    expect(lastProps(spy).activeDataKey).toBeUndefined();
    expect(lastProps(spy).activeGraphicalItemId).toBeUndefined();
  });

  it('should identify the hovered Bar in a shared tooltip', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <BarChart width={400} height={400} data={PageData}>
        <Bar dataKey="uv" id="bar-uv" />
        <Bar dataKey="pv" id="bar-pv" />
        <Tooltip shared content={spy} />
        {children}
      </BarChart>
    ));
    const { container, debug } = renderTestCase();
    showTooltip(container, barChartItemMouseHoverTooltipSelector, debug);
    const bar = container.querySelector(barChartItemMouseHoverTooltipSelector);
    assertNotNull(bar);
    fireEvent.mouseEnter(bar);
    const props = lastProps(spy);
    expect(props.active).toBe(true);
    expect(props.payload.length).toBe(2);
    expect(props.activeDataKey).toBe('uv');
    expect(props.activeGraphicalItemId).toBe('bar-uv');
  });

  it('should be undefined when hovering the chart background', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <BarChart width={400} height={400} data={PageData}>
        <Bar dataKey="uv" id="bar-uv" />
        <Tooltip shared content={spy} />
        {children}
      </BarChart>
    ));
    const { container, debug } = renderTestCase();
    showTooltip(container, barChartMouseHoverTooltipSelector, debug);
    const props = lastProps(spy);
    expect(props.active).toBe(true);
    expect(props.activeDataKey).toBeUndefined();
    expect(props.activeGraphicalItemId).toBeUndefined();
  });

  it('should identify the hovered Bar when shared={false}', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <BarChart width={400} height={400} data={PageData}>
        <Bar dataKey="uv" id="bar-uv" />
        <Bar dataKey="pv" id="bar-pv" />
        <Tooltip shared={false} content={spy} />
        {children}
      </BarChart>
    ));
    const { container, debug } = renderTestCase();
    showTooltip(container, barChartItemMouseHoverTooltipSelector, debug);
    const bar = container.querySelector(barChartItemMouseHoverTooltipSelector);
    assertNotNull(bar);
    fireEvent.mouseEnter(bar);
    const props = lastProps(spy);
    expect(props.active).toBe(true);
    expect(props.activeDataKey).toBe('uv');
    expect(props.activeGraphicalItemId).toBe('bar-uv');
  });

  it('should identify the hovered Pie sector', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <PieChart width={400} height={400}>
        <Pie data={PageData} dataKey="uv" id="pie-uv" isAnimationActive={false} />
        <Tooltip content={spy} />
        {children}
      </PieChart>
    ));
    const { container, debug } = renderTestCase();
    showTooltip(container, pieChartMouseHoverTooltipSelector, debug);
    const props = lastProps(spy);
    expect(props.active).toBe(true);
    expect(props.activeDataKey).toBe('uv');
    expect(props.activeGraphicalItemId).toBe('pie-uv');
  });

  it('should not set the active item for a Line chart hovered on the background', () => {
    const renderTestCase = createSelectorTestCase(({ children }) => (
      <LineChart width={400} height={400} data={PageData}>
        <Line dataKey="uv" id="line-uv" />
        <Tooltip content={spy} />
        {children}
      </LineChart>
    ));
    const { container, debug } = renderTestCase();
    showTooltip(container, '.recharts-wrapper', debug);
    const props = lastProps(spy);
    expect(props.active).toBe(true);
    expect(props.payload.length).toBe(1);
    expect(props.activeDataKey).toBeUndefined();
  });
});
