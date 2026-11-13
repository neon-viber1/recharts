import { createSelector } from 'reselect';
import { RechartsRootState } from '../store';
import { XAxisSettings, YAxisSettings } from '../cartesianAxisSlice';

export const selectAllXAxes: (state: RechartsRootState) => ReadonlyArray<XAxisSettings> = createSelector(
  (state: RechartsRootState) => state.cartesianAxis.xAxis,
  (state: RechartsRootState) => state.cartesianAxis.xAxisOrder,
  (xAxisMap, order): ReadonlyArray<XAxisSettings> => {
    const result: Array<XAxisSettings> = [];
    order.forEach(id => {
      const axis = xAxisMap[id];
      if (axis) {
        result.push(axis);
      }
    });
    return result;
  },
);

export const selectAllYAxes: (state: RechartsRootState) => ReadonlyArray<YAxisSettings> = createSelector(
  (state: RechartsRootState) => state.cartesianAxis.yAxis,
  (state: RechartsRootState) => state.cartesianAxis.yAxisOrder,
  (yAxisMap, order): ReadonlyArray<YAxisSettings> => {
    const result: Array<YAxisSettings> = [];
    order.forEach(id => {
      const axis = yAxisMap[id];
      if (axis) {
        result.push(axis);
      }
    });
    return result;
  },
);
