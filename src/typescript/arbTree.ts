import * as fc from "fast-check"
import * as T from "fp-ts/lib/Tree"

export function getArbitrary<T>(
  arb: fc.Arbitrary<T>,
  opts: {
    maxDepth?: number
    maxWidth?: number
  } = {}
): fc.Arbitrary<T.Tree<T>> {
  const tree: fc.Memo<T.Tree<T>> = fc.memo<
    T.Tree<T>
  >(n => {
    return n <= 1
      ? fc.record({
          value: arb,
          forest: fc.constant([]),
        })
      : fc.record({
          value: arb,
          forest:
            opts.maxWidth === undefined
              ? fc.array(tree())
              : fc.array(tree(), opts.maxWidth),
        })
  })
  return tree(opts.maxDepth)
}

fc.sample(
  getArbitrary<number>(fc.nat(), {
    maxWidth: 5,
    maxDepth: 1,
  })
) //?
