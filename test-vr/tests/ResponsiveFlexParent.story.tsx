import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from '../../src';

const data = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D', uv: 2780 },
  { name: 'Page E', uv: 1890 },
];

/*
 * A card with a fixed height, a header that does not flex, and a content area that grows to fill the rest.
 * The chart must follow the size of the content area, in both directions.
 */
export const ResponsiveInFlexColumn = ({ cardHeight = 260 }: { cardHeight?: number }) => (
  <div
    id="card"
    style={{ display: 'flex', flexDirection: 'column', width: 400, height: cardHeight, border: '1px solid gray' }}
  >
    <div style={{ flex: 'none', padding: 8 }}>this is a chart</div>
    <div id="content" style={{ flex: 1 }}>
      <AreaChart data={data} responsive style={{ width: '100%', height: '100%' }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Area dataKey="uv" isAnimationActive={false} />
      </AreaChart>
    </div>
  </div>
);
