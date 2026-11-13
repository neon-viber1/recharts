import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Line, LineChart, Tooltip, useIsTooltipActive, useTooltipActions } from '../../src';
import { PageData } from '../_data';
import {
  expectTooltipNotVisible,
  expectTooltipPayload,
  getTooltip,
  showTooltip,
  showTooltipClick,
} from '../component/Tooltip/tooltipTestHelpers';
import { areaChartMouseHoverTooltipSelector } from '../component/Tooltip/tooltipMouseHoverSelectors';
import { mockGetBoundingClientRect } from '../helper/mockGetBoundingClientRect';

let actions: ReturnType<typeof useTooltipActions> | undefined, lastActive: boolean | undefined;

function Probe(): null {
  actions = useTooltipActions();
  lastActive = useIsTooltipActive();
  return null;
}

function renderChart(tooltipProps: React.ComponentProps<typeof Tooltip> = {}) {
  return render(
    <LineChart width={400} height={400} data={PageData}>
      <Line dataKey="uv" isAnimationActive={false} />
      <Tooltip isAnimationActive={false} {...tooltipProps} />
      <Probe />
    </LineChart>,
  );
}

describe('useTooltipActions', () => {
  beforeEach(() => {
    mockGetBoundingClientRect({ width: 100, height: 100 });
    actions = undefined;
    lastActive = undefined;
  });

  it('does nothing outside of a chart', () => {
    const Comp = (): null => {
      actions = useTooltipActions();
      return null;
    };
    render(<Comp />);
    expect(() => {
      actions?.hideTooltip();
      actions?.showTooltip(1);
    }).not.toThrow();
  });

  it('returns stable functions', () => {
    const { rerender } = renderChart();
    const first = actions;
    rerender(
      <LineChart width={400} height={400} data={PageData}>
        <Line dataKey="uv" isAnimationActive={false} />
        <Tooltip isAnimationActive={false} />
        <Probe />
      </LineChart>,
    );
    expect(actions).toBe(first);
  });

  it('hideTooltip is a no-op when no tooltip is active', () => {
    const { container } = renderChart();
    actions?.hideTooltip();
    expectTooltipNotVisible(container);
    expect(lastActive).toBe(false);
  });

  it('hideTooltip hides a hover tooltip, and hover reopens it', () => {
    const { container } = renderChart();
    showTooltip(container, areaChartMouseHoverTooltipSelector);
    expect(lastActive).toBe(true);
    expect(getTooltip(container)).toBeVisible();

    act(() => actions?.hideTooltip());
    expect(lastActive).toBe(false);
    expectTooltipNotVisible(container);

    showTooltip(container, areaChartMouseHoverTooltipSelector);
    expect(lastActive).toBe(true);
    expect(getTooltip(container)).toBeVisible();
  });

  it('hideTooltip hides a click tooltip', () => {
    const { container } = renderChart({ trigger: 'click' });
    showTooltipClick(container, areaChartMouseHoverTooltipSelector);
    expect(lastActive).toBe(true);
    act(() => actions?.hideTooltip());
    expect(lastActive).toBe(false);
    expectTooltipNotVisible(container);
  });

  it('hideTooltip hides a keyboard tooltip', () => {
    const { container } = renderChart();
    const wrapper = container.querySelector('.recharts-wrapper');
    if (wrapper == null) throw new Error('no wrapper');
    fireEvent.focus(wrapper);
    fireEvent.keyDown(wrapper, { key: 'ArrowRight' });
    expect(lastActive).toBe(true);
    act(() => actions?.hideTooltip());
    expect(lastActive).toBe(false);
  });

  it('showTooltip(index) activates the tooltip for that index', () => {
    const { container } = renderChart();
    act(() => actions?.showTooltip(2));
    expect(lastActive).toBe(true);
    expectTooltipPayload(container, '2', ['uv : 300']);
  });

  it.each([null, undefined, -1, 1.5, '', 'abc'])('showTooltip(%s) hides the tooltip', invalid => {
    const { container } = renderChart();
    act(() => actions?.showTooltip(1));
    expect(lastActive).toBe(true);
    act(() => actions?.showTooltip(invalid));
    expect(lastActive).toBe(false);
    expectTooltipNotVisible(container);
  });
});
