import React, { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent } from '@testing-library/react';
import { Cell, Pie, PieChart, Tooltip } from '../../../src';
import { PageData } from '../../_data';
import { createSelectorTestCase } from '../../helper/createSelectorTestCase';

const data = PageData.slice(0, 3);
const onAnimationStart = vi.fn();

function HoverStyledPie() {
  const [focus, setFocus] = useState<number | null>(null);
  return (
    <Pie data={data} dataKey="amt" isAnimationActive onAnimationStart={onAnimationStart}>
      {data.map((entry, i) => (
        <Cell
          key={entry.name}
          fillOpacity={focus === i ? 1 : 0.5}
          onMouseEnter={() => setFocus(i)}
          onMouseLeave={() => setFocus(null)}
        />
      ))}
    </Pie>
  );
}

const renderTestCase = createSelectorTestCase(({ children }) => (
  <PieChart width={400} height={400}>
    <HoverStyledPie />
    <Tooltip />
    {children}
  </PieChart>
));

describe('Pie with hover-driven Cell styles', () => {
  it('should not restart the animation or remount sectors when only a Cell style changes', async () => {
    onAnimationStart.mockClear();
    const { container, animationManager } = renderTestCase();
    await animationManager.completeAnimation();
    const startCount = onAnimationStart.mock.calls.length;
    const sectors = container.querySelectorAll('.recharts-pie-sector');
    expect(sectors).toHaveLength(3);

    act(() => {
      fireEvent.mouseOver(sectors[0].querySelector('path') ?? sectors[0]);
    });
    const after = container.querySelectorAll('.recharts-pie-sector');
    expect(after[0].querySelector('path')).toHaveAttribute('fill-opacity', '1');
    expect(after[0]).toBe(sectors[0]);
    expect(onAnimationStart.mock.calls.length).toBe(startCount);
  });
});
