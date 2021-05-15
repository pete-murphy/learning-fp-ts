import { useRef } from "react"
import { Eq, IO } from "../fp-ts-imports"

import { usePrevious } from "./usePrevious"
import { isNil, isNotNil } from "../typeGuards"

/**
 * An alternative version of `useMemo` that allows you to use an `Eq` to check your dependencies.
 *
 * This lets you do a potentially expensive computation and cache the result as long as the dependencies
 * haven't changed. This also creates stable references for the `A` value, so this can be used as a lazy
 * alternative to `useStable`.
 */
export const useMemoEq = <A, D extends Array<unknown>>(
  getValue: IO.IO<A>,
  dependencies: D,
  eq: Eq.Eq<D>
): A => {
  const valueRef = useRef<A>()

  const previousDependencies = usePrevious(dependencies)

  // If the ref has never been set (e.g. first run), set it now
  // On successive runs, re-compute the ref if the deps have changed
  if (isNil(valueRef.current)) {
    valueRef.current = getValue()
  } else if (
    isNotNil(previousDependencies) &&
    !eq.equals(previousDependencies, dependencies)
  ) {
    valueRef.current = getValue()
  }

  // In theory, this should not be null, since it should get set on the first run
  return valueRef.current
}
