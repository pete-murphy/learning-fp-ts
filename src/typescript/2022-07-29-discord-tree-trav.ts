import { tree as T, array as A, foldable as Fld } from "fp-ts"
import { pipe } from "fp-ts/function"

const tree: T.Tree<string> = T.make("a", [
  T.make("b1", [T.make("c"), T.make("d")]),
  T.make("b2", [T.make("c", [T.make("foo")])])
])

T.drawTree(tree) //?
// a
// ├─ b1
// │  ├─ c
// │  └─ d
// └─ b2
//    └─ c
//       └─ foo

const treeFold = pipe(
  tree,
  T.fold((x: string, xs: Array<T.Tree<Array<string>>>) =>
    T.make([x], pipe(xs, A.map(T.map(a => [x].concat(a)))))
  ),
  T.map(JSON.stringify)
)

T.drawTree(treeFold) //?
// ["a"]
// ├─ ["a","b1"]
// │  ├─ ["a","b1","c"]
// │  └─ ["a","b1","d"]
// └─ ["a","b2"]
//    └─ ["a","b2","c"]
//       └─ ["a","b2","c","foo"]

const treeExtend = pipe(
  tree,
  T.extend(Fld.toReadonlyArray(T.Foldable)),
  T.map(JSON.stringify)
)

T.drawTree(treeExtend) //?
// ["a","b1","c","d","b2","c","foo"]
// ├─ ["b1","c","d"]
// │  ├─ ["c"]
// │  └─ ["d"]
// └─ ["b2","c","foo"]
//    └─ ["c","foo"]
//       └─ ["foo"]
