import { createContext, useContext } from 'react';

/**
 * True when the chart wrapper measures its own box and sizes the SVG from it (the `responsive` prop).
 * In that case the SVG must not take part in the layout of the wrapper, otherwise it would feed its
 * last size back into the container and prevent it from shrinking inside flex and grid parents.
 */
const ResponsiveWrapperContext = createContext<boolean>(false);

export const ResponsiveWrapperProvider = ResponsiveWrapperContext.Provider;

export function useIsResponsiveWrapper(): boolean {
  return useContext(ResponsiveWrapperContext);
}
