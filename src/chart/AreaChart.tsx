import * as React from 'react';
import { forwardRef } from 'react';
import { toGenericChart } from '../util/genericChart';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { CartesianChart } from './CartesianChart';
import { CartesianChartProps, TooltipEventType } from '../util/types';

const allowedTooltipTypes: ReadonlyArray<TooltipEventType> = ['axis'];

/**
 * @consumes ResponsiveContainerContext
 * @provides CartesianViewBoxContext
 * @provides CartesianChartContext
 * @public
 */
export const AreaChart: <DataPointType = any>(
  props: CartesianChartProps<DataPointType> & { ref?: React.Ref<SVGSVGElement> },
) => React.ReactElement = toGenericChart(
  forwardRef<SVGSVGElement, CartesianChartProps<unknown>>((props: CartesianChartProps<unknown>, ref) => {
    return (
      <CartesianChart
        chartName="AreaChart"
        defaultTooltipEventType="axis"
        validateTooltipEventTypes={allowedTooltipTypes}
        tooltipPayloadSearcher={arrayTooltipSearcher}
        categoricalChartProps={props}
        ref={ref}
      />
    );
  }),
);
