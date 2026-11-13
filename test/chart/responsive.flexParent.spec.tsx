import React from 'react';
import { act, render } from '@testing-library/react';
import { mockGetBoundingClientRect } from '../helper/mockGetBoundingClientRect';
import { ComposedChart, Line } from '../../src';
import { PageData } from '../_data';

describe('responsive prop inside a flex parent', () => {
  let resizeObserverCallback: (entries: ResizeObserverEntry[]) => void;

  beforeEach(() => {
    mockGetBoundingClientRect({ width: 500, height: 400 });
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(function ResizeObserverMock(cb) {
        resizeObserverCallback = cb;
        return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
      }),
    );
  });

  function renderChart(responsive: boolean) {
    return render(
      <div style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
        <div style={{ flex: 1 }}>
          <ComposedChart responsive={responsive} width={500} height={400} data={PageData}>
            <Line dataKey="uv" />
          </ComposedChart>
        </div>
      </div>,
    );
  }

  it('should take the SVG out of the layout flow so that the container is able to shrink', () => {
    const { container } = renderChart(true);
    const svg = container.querySelector('svg.recharts-surface');
    expect(svg).toHaveStyle({ position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%' });
  });

  it('should follow the container when it gets smaller', () => {
    const { container } = renderChart(true);
    const svg = container.querySelector('svg.recharts-surface');
    expect(svg).toHaveAttribute('width', '500');
    act(() => {
      resizeObserverCallback([
        {
          target: document.body,
          contentRect: new DOMRect(0, 0, 300, 200),
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ]);
    });
    const svgAfter = container.querySelector('svg.recharts-surface');
    expect(svgAfter).toHaveAttribute('width', '300');
    expect(svgAfter).toHaveAttribute('height', '200');
  });

  it('should keep the SVG in the layout flow when responsive is false', () => {
    const { container } = renderChart(false);
    const svg = container.querySelector('svg.recharts-surface');
    expect(svg).not.toHaveStyle({ position: 'absolute' });
  });
});
