import {
  IO,
  pipe,
  Tree,
  Com,
  N,
  identity
} from "./lib/fp-ts-imports"

const x: Tree.Tree<number> = Tree.make(1, [
  Tree.make(1, [Tree.make(1)]),
  Tree.make(1, [Tree.make(1)])
])

pipe(
  x,
  Tree.map(x => x.toString()),
  Tree.drawTree
) //?

pipe(
  x,
  Tree.extend(Tree.foldMap(N.MonoidSum)(identity)),
  // Tree.drawTree
  Tree.map(x => x.toString()),
  Tree.drawTree
) //?
