import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import { BarChart } from '../../src';
import { RechartsWrapper } from '../../src/chart/RechartsWrapper';
import { assertNotNull } from '../helper/assertNotNull';

describe('RechartsWrapper', () => {
  it('should call onMouseEnter, and onMouseLeave handlers', async () => {
    const onMouseEnterSpy = vi.fn();
    const onMouseLeaveSpy = vi.fn();
    const { container } = render(
      <BarChart width={800} height={400} onMouseEnter={onMouseEnterSpy} onMouseLeave={onMouseLeaveSpy} />,
    );

    const wrapper = container.querySelector('.recharts-wrapper');
    assertNotNull(wrapper);
    expect(wrapper).toBeInTheDocument();

    expect(onMouseEnterSpy).not.toHaveBeenCalled();
    expect(onMouseLeaveSpy).not.toHaveBeenCalled();

    fireEvent.mouseEnter(wrapper);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(onMouseEnterSpy).toHaveBeenCalledTimes(1);
    expect(onMouseLeaveSpy).not.toHaveBeenCalled();

    fireEvent.mouseLeave(wrapper);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(onMouseEnterSpy).toHaveBeenCalledTimes(1);
    expect(onMouseLeaveSpy).toHaveBeenCalledTimes(1);
  });

  describe('native drag prevention', () => {
    it('should prevent dragstart from chart svg and text, and keep mouse handlers working', () => {
      const onMouseDown = vi.fn();
      const onMouseUp = vi.fn();
      const { container } = render(
        <BarChart width={800} height={400} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
          <text className="label">hello</text>
        </BarChart>,
      );
      const svg = container.querySelector('svg');
      const text = container.querySelector('text.label');
      assertNotNull(svg);
      assertNotNull(text);
      expect(fireEvent.dragStart(svg)).toBe(false);
      expect(fireEvent.dragStart(text)).toBe(false);

      const wrapper = container.querySelector('.recharts-wrapper');
      assertNotNull(wrapper);
      fireEvent.mouseDown(wrapper);
      fireEvent.mouseUp(wrapper);
      act(() => {
        vi.runOnlyPendingTimers();
      });
      expect(onMouseDown).toHaveBeenCalledTimes(1);
      expect(onMouseUp).toHaveBeenCalledTimes(1);
    });

    it('should not prevent dragstart from an explicitly draggable element', () => {
      const { container } = render(
        <RechartsWrapper width={100} height={100} responsive={false}>
          <div draggable="true">
            <span data-testid="inner">drag me</span>
          </div>
        </RechartsWrapper>,
      );
      const inner = container.querySelector('[data-testid="inner"]');
      assertNotNull(inner);
      expect(fireEvent.dragStart(inner)).toBe(true);
    });
  });

  it('should disconnect the previous ResizeObserver before creating a new one when the DOM node changes', () => {
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    // Mock global ResizeObserver
    const ResizeObserverMock = vi.fn(function ResizeObserverMock() {
      return {
        observe: observeSpy,
        unobserve: vi.fn(),
        disconnect: disconnectSpy,
      };
    });
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    // Initial render. Passing an inline function ref guarantees the component invokes the callback
    // ref and goes through the observer setup on re-render.
    const { rerender } = render(
      <RechartsWrapper responsive width={100} height={100} ref={() => {}}>
        <div />
      </RechartsWrapper>,
    );

    expect(ResizeObserverMock).toHaveBeenCalledTimes(1);
    expect(observeSpy).toHaveBeenCalledTimes(1);
    expect(disconnectSpy).not.toHaveBeenCalled();

    // Re-render with a newly created inline function ref to force React to call
    // the callback ref again. This simulates a ref change that causes a new ResizeObserver to be instantiated.
    rerender(
      <RechartsWrapper responsive width={100} height={100} ref={() => {}}>
        <div />
      </RechartsWrapper>,
    );

    // The test asserts that the first observer was disconnected before the second one is created
    expect(disconnectSpy).toHaveBeenCalledTimes(1);

    // Assert that a second observer wrapper was indeed created
    expect(ResizeObserverMock).toHaveBeenCalledTimes(2);
    expect(observeSpy).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
  });

  it('should not throw when ref callback receives null (React 19 Suspense disappearLayoutEffects)', () => {
    // In React 19, Suspense can trigger a "disappear" layout effect where
    // the ref callback is called with null before the component unmounts.
    // This test verifies that setTooltipPortal/setLegendPortal are guarded
    // against null to prevent state updates during this phase.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      const { unmount } = render(
        <RechartsWrapper responsive width={100} height={100}>
          <div />
        </RechartsWrapper>,
      );

      // Unmount should not trigger "Cannot update during an existing state transition" warnings
      unmount();

      const errors = errorSpy.mock.calls
        .map(call => call[0])
        .filter(msg => typeof msg === 'string' && msg.includes('state'));
      const warns = warnSpy.mock.calls
        .map(call => call[0])
        .filter(msg => typeof msg === 'string' && msg.includes('state'));

      expect(errors).toHaveLength(0);
      expect(warns).toHaveLength(0);
    } finally {
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });
});
