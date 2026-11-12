import { BaseLineType } from '../shape/Curve';
import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
import { CartesianLayout, NullableCoordinate } from '../util/types';

/**
 * A line from the baseline to the value of a point that is not connected to any other point,
 * so the area would otherwise draw nothing for it.
 */
export interface IsolatedAreaStem {
  index: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function isDefined(point: NullableCoordinate | undefined): point is { x: number; y: number } {
  return point != null && isWellBehavedNumber(point.x) && isWellBehavedNumber(point.y);
}

/**
 * Finds points that have a value but no defined neighbour, and so are drawn as a zero-width area.
 * With `connectNulls`, gaps are bridged, so only a lone defined point is isolated.
 *
 * @param points area points
 * @param baseLine scalar baseline or per-point baseline
 * @param layout chart layout
 * @param connectNulls whether null points are bridged
 * @returns one stem per isolated point
 */
export function getIsolatedAreaPoints(
  points: ReadonlyArray<NullableCoordinate> | undefined,
  baseLine: BaseLineType | undefined,
  layout: CartesianLayout | undefined,
  connectNulls: boolean | undefined,
): ReadonlyArray<IsolatedAreaStem> {
  if (points == null || points.length === 0) {
    return [];
  }
  const isVertical = layout === 'vertical';
  const definedCount = points.filter(isDefined).length;
  const result: IsolatedAreaStem[] = [];

  points.forEach((point, index) => {
    if (!isDefined(point)) {
      return;
    }
    const isIsolated = connectNulls
      ? definedCount === 1
      : !isDefined(points[index - 1]) && !isDefined(points[index + 1]);
    if (!isIsolated) {
      return;
    }
    let base: number | null | undefined;
    if (Array.isArray(baseLine)) {
      const entry: NullableCoordinate | undefined = baseLine[index];
      base = isVertical ? entry?.x : entry?.y;
    } else if (typeof baseLine === 'number') {
      base = baseLine;
    }
    if (!isWellBehavedNumber(base)) {
      return;
    }
    result.push(
      isVertical
        ? { index, x1: base, y1: point.y, x2: point.x, y2: point.y }
        : { index, x1: point.x, y1: base, x2: point.x, y2: point.y },
    );
  });
  return result;
}
