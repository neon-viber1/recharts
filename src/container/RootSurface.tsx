import * as React from 'react';
import { forwardRef, ReactNode } from 'react';
import { useChartHeight, useChartWidth } from '../context/chartLayoutContext';
import { useAccessibilityLayer } from '../context/accessibilityContext';
import { useIsPanorama } from '../context/PanoramaContext';
import { useIsResponsiveWrapper } from '../context/responsiveWrapperContext';
import { Surface } from './Surface';
import { useAppSelector } from '../state/hooks';
import { selectBrushDimensions } from '../state/selectors/brushSelectors';
import { isPositiveNumber } from '../util/isWellBehavedNumber';
import { AllZIndexPortals } from '../zIndex/ZIndexPortal';

type RootSurfaceProps = {
  children: ReactNode;
  title: string | undefined;
  desc: string | undefined;
  otherAttributes: Record<string, unknown> | null;
};

const FULL_WIDTH_AND_HEIGHT = {
  width: '100%',
  height: '100%',
  /*
   * display: block is necessary here because the default for an SVG is display: inline,
   * which in some browsers (Chrome) adds a little bit of extra space above and below the SVG
   * to make space for the descender of letters like "g" and "y". This throws off the height calculation
   * and causes the container to grow indefinitely on each render with responsive=true.
   * Display: block removes that extra space.
   *
   * Interestingly, Firefox does not have this problem, but it doesn't hurt to add the style anyway.
   */
  display: 'block',
};

/*
 * With responsive=true the wrapper is measured and the SVG is sized from that measurement.
 * If the SVG stayed in the normal flow, its last size would act as the minimum size of the wrapper's
 * flex/grid parent and the chart could grow but never shrink. Taking it out of the flow breaks that loop.
 */
const OUT_OF_FLOW = { position: 'absolute', top: 0, left: 0 } as const;

const RESPONSIVE_STYLE = { ...FULL_WIDTH_AND_HEIGHT, ...OUT_OF_FLOW };

const MainChartSurface = forwardRef<SVGSVGElement, RootSurfaceProps>((props: RootSurfaceProps, ref) => {
  const width = useChartWidth();
  const height = useChartHeight();
  const hasAccessibilityLayer = useAccessibilityLayer();
  const isResponsive = useIsResponsiveWrapper();

  if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
    return null;
  }

  const { children, otherAttributes, title, desc } = props;

  let tabIndex: number | undefined, role: string | undefined;

  if (otherAttributes != null) {
    if (typeof otherAttributes.tabIndex === 'number') {
      tabIndex = otherAttributes.tabIndex;
    } else {
      tabIndex = hasAccessibilityLayer ? 0 : undefined;
    }

    if (typeof otherAttributes.role === 'string') {
      role = otherAttributes.role;
    } else {
      role = hasAccessibilityLayer ? 'application' : undefined;
    }
  }

  return (
    <Surface
      {...otherAttributes}
      title={title}
      desc={desc}
      role={role}
      tabIndex={tabIndex}
      width={width}
      height={height}
      style={isResponsive ? RESPONSIVE_STYLE : FULL_WIDTH_AND_HEIGHT}
      ref={ref}
    >
      {children}
    </Surface>
  );
});

const BrushPanoramaSurface = ({ children }: { children: ReactNode }) => {
  const brushDimensions = useAppSelector(selectBrushDimensions);

  if (!brushDimensions) {
    return null;
  }

  const { width, height, y, x } = brushDimensions;

  return (
    <Surface width={width} height={height} x={x} y={y}>
      {children}
    </Surface>
  );
};

export const RootSurface = forwardRef<SVGSVGElement, RootSurfaceProps>(
  ({ children, ...rest }: RootSurfaceProps, ref) => {
    const isPanorama = useIsPanorama();

    if (isPanorama) {
      return (
        <BrushPanoramaSurface>
          <AllZIndexPortals isPanorama>{children}</AllZIndexPortals>
        </BrushPanoramaSurface>
      );
    }
    return (
      <MainChartSurface ref={ref} {...rest}>
        <AllZIndexPortals isPanorama={false}>{children}</AllZIndexPortals>
      </MainChartSurface>
    );
  },
);
