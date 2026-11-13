import * as React from 'react';
import { forwardRef } from 'react';
import { toGenericChart } from '../util/genericChart';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { CartesianChartProps, TooltipEventType } from '../util/types';
import { CartesianChart } from './CartesianChart';

const allowedTooltipTypes: ReadonlyArray<TooltipEventType> = ['axis', 'item'];

/**
 * @consumes ResponsiveContainerContext
 * @provides CartesianViewBoxContext
 * @provides CartesianChartContext
 * @public
 */
export const BarChart: <DataPointType = any>(
  props: CartesianChartProps<DataPointType> & { ref?: React.Ref<SVGSVGElement> },
) => React.ReactElement = toGenericChart(
  forwardRef<SVGSVGElement, CartesianChartProps<unknown>>((props: CartesianChartProps<unknown>, ref) => {
    return (
      <CartesianChart
        chartName="BarChart"
        defaultTooltipEventType="axis"
        validateTooltipEventTypes={allowedTooltipTypes}
        tooltipPayloadSearcher={arrayTooltipSearcher}
        categoricalChartProps={props}
        ref={ref}
      />
    );
  }),
);
