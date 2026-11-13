import React from 'react';
import { Args } from '@storybook/react-vite';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  useTooltipActions,
  XAxis,
  YAxis,
} from '../../../../src';
import { pageData } from '../../data';

export default {
  title: 'API/hooks/useTooltipActions',
  component: useTooltipActions,
  parameters: {
    docs: {
      description: {
        component:
          'This story demonstrates the `useTooltipActions` hook: buttons rendered inside the chart hide the Tooltip or show it at a given index.',
      },
    },
  },
};

function TooltipButtons() {
  const { hideTooltip, showTooltip } = useTooltipActions();
  return (
    <foreignObject x={60} y={0} width={320} height={30}>
      <button type="button" onClick={() => showTooltip(2)}>
        Show index 2
      </button>
      <button type="button" onClick={hideTooltip}>
        Hide tooltip
      </button>
    </foreignObject>
  );
}

export const UseTooltipActions = {
  name: 'useTooltipActions',
  render: (args: Args) => (
    <ResponsiveContainer width={args.width} height={args.height}>
      <LineChart data={pageData}>
        <CartesianGrid />
        <XAxis dataKey="name" />
        <YAxis />
        <Line dataKey="pv" />
        <Tooltip />
        <TooltipButtons />
      </LineChart>
    </ResponsiveContainer>
  ),
  args: {
    width: '100%',
    height: 400,
  },
};
