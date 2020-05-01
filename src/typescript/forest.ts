import { Forest, make, Tree } from "fp-ts/lib/Tree"
import { findFirst, cons, chain } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import {
  flow,
  Refinement,
  Predicate,
} from "fp-ts/lib/function"
import { Option } from "fp-ts/lib/Option"

type Node = {
  key: string
  value: number
}

const exampleForest: Forest<Node> = [
  make({ key: "a", value: 1 }, [
    make({ key: "b", value: 2 }),
    make({ key: "c", value: 3 }, [
      make({ key: "d", value: 4 }),
    ]),
  ]),
]

const flattenTree = <A>(tree: Tree<A>): Array<A> =>
  cons(tree.value, chain(flattenTree)(tree.forest))

const findFirstForest = <A>(
  f: Predicate<A>
): ((forest: Forest<A>) => Option<A>) =>
  flow(chain(flattenTree), findFirst(f))
