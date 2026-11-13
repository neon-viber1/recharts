import type { ExoticComponent, ReactElement } from 'react';

/**
 * Gives a forwardRef component a generic call signature.
 *
 * `forwardRef` erases generic type parameters, so a type-check suppression is unavoidable here.
 * It is isolated in this single line so that all chart components share it.
 *
 * Declare the generic call signature on the exported const; it must return `ReactElement` and not `ReactNode`,
 * because `ReactNode` is a valid JSX return type only since TypeScript 5.1 and we support TypeScript 4.x consumers.
 *
 * @param component the result of `forwardRef`
 * @returns the same component, typed as generic
 */
export function toGenericChart<Result extends (props: never) => ReactElement>(
  component: ExoticComponent<never>,
): Result {
  // @ts-expect-error forwardRef does not preserve generics; the caller declares the intended generic signature via Result
  return component;
}
