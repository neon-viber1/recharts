import { describe, it, expect } from 'vitest';
import { createRechartsStore } from '../../src/state/store';
import { addLegendPayload, removeLegendPayload, setLegendSize } from '../../src/state/legendSlice';
import { LegendPayload } from '../../src/component/DefaultLegendContent';

describe('legendSlice', () => {
  it('should add and remove legend payload from state', () => {
    const store = createRechartsStore();
    expect(store.getState().legend.payload).toHaveLength(0);

    const payload1: ReadonlyArray<LegendPayload> = [{ dataKey: 'key', value: 'value' }];
    const payload2: ReadonlyArray<LegendPayload> = [{ dataKey: 'key', value: 'value' }];
    store.dispatch(addLegendPayload(payload1));
    expect(store.getState().legend.payload).toHaveLength(1);

    store.dispatch(addLegendPayload(payload2));
    expect(store.getState().legend.payload).toHaveLength(2);

    store.dispatch(removeLegendPayload(payload1));
    expect(store.getState().legend.payload).toHaveLength(1);

    store.dispatch(removeLegendPayload(payload2));
    expect(store.getState().legend.payload).toHaveLength(0);

    store.dispatch(removeLegendPayload(payload1));
    expect(store.getState().legend.payload).toHaveLength(0);
  });

  it('should keep the same state reference when the legend size is unchanged', () => {
    const store = createRechartsStore();
    store.dispatch(setLegendSize({ width: 10, height: 20 }));
    const before = store.getState().legend;
    store.dispatch(setLegendSize({ width: 10, height: 20 }));
    expect(store.getState().legend).toBe(before);
  });
});
