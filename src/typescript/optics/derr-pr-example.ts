import * as Arr from "fp-ts/lib/Array"
import * as O from "fp-ts/lib/Option"
import * as NEA from "fp-ts/lib/NonEmptyArray"
import * as T from "fp-ts/lib/Tree"

import { constant, pipe } from "fp-ts/lib/function"
import { indexArray } from "monocle-ts/lib/Index/Array"
import { Index, Lens, Optional } from "monocle-ts"

/**
 * A NodePath represents a path from a forest to a particular tree.
 */
type NodePath = NEA.NonEmptyArray<number>

/**
 * Changes a path to the parent of a node, if one exists.
 */
export const getParent = (path: NodePath): O.Option<NodePath> =>
  pipe(path, NEA.init, NEA.fromArray)

export function getForestOptionalFromPath<A>(path: NEA.NonEmptyArray<number>) {
  return pipe(
    getParent(path),
    O.getOrElse<Array<number>>(() => []),
    Arr.reduce(
      new Optional<T.Forest<A>, T.Forest<A>>(O.some, constant),
      (fo, i) =>
        fo
          .compose(indexArray<T.Tree<A>>().index(i))
          .composeLens(Lens.fromProp<T.Tree<A>>()("forest"))
    )
  )
}

// export const indexForest: <A = never>() => Index<T.Forest<A>, NEA.NonEmptyArray<number>, T.Forest<A>> =  <A>(path:) {
//   return pipe(
//     getParent(path),
//     O.getOrElse<Array<number>>(() => []),
//     Arr.reduce(
//       new Optional<T.Forest<A>, T.Forest<A>>(O.some, constant),
//       (fo, i) =>
//         fo
//           .compose(indexArray<T.Tree<A>>().index(i))
//           .composeLens(Lens.fromProp<T.Tree<A>>()("forest"))
//     )
//   )
// }

export function getTreeOptionalFromPath<A>(
  path: NEA.NonEmptyArray<number>
): Optional<T.Forest<A>, T.Tree<A>> {
  return getForestOptionalFromPath<A>(path).compose(
    indexArray<T.Tree<A>>().index(NEA.last(path))
  )
}
