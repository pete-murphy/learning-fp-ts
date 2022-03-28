import { Com, pipe, St, Tree } from "./lib/fp-ts-imports"

const exampleTree: Tree.Tree<string> = Tree.make("foo", [
  Tree.make("bar", [
    Tree.make("bar-1"),
    Tree.make("bar-2"),
    Tree.make("bar-3")
  ]),
  Tree.make("baz", [
    Tree.make("baz-1"),
    Tree.make("baz-2"),
    Tree.make("baz-3"),
    Tree.make("baz-4"),
    Tree.make("baz-5"),
    Tree.make("baz-6")
  ]),
  Tree.make("quux", [
    Tree.make("quux-1"),
    Tree.make("quux-2"),
    Tree.make("quux-3"),
    Tree.make("quux-4")
  ]),
  Tree.make("quuz", [
    Tree.make("quuz-1"),
    Tree.make("quuz-2"),
    Tree.make("quuz-3"),
    Tree.make("quuz-4"),
    Tree.make("quuz-5")
  ])
])

const [treeWithIndices, totalNodesAtDepths] = pipe(
  exampleTree,
  Tree.extend(node => ({
    name: node,
    forestLength: node.forest.length
  })),
  Tree.traverseWithIndex(St.Applicative)(
    (ns, a) => (totalNodesAtDepths: Array<number>) => {
      totalNodesAtDepths[ns.length] =
        (totalNodesAtDepths[ns.length] | 0) + 1
      return [
        {
          name: a.name,
          forestLength: a.forestLength,
          indexAtDepth: totalNodesAtDepths[ns.length] - 1,
          depth: ns.length
        },
        totalNodesAtDepths
      ]
    }
  ),
  f => f([])
)

const flattenedTreeWithEnoughDataToRender = pipe(
  treeWithIndices,
  Tree.map(a => {
    const z =
      (a.forestLength | 1) /
      (totalNodesAtDepths[a.depth + 1] | 1)
    return {
      name: a.name,
      x0:
        (z * a.indexAtDepth) / totalNodesAtDepths[a.depth],
      x1:
        (z * (a.indexAtDepth + 1)) /
        totalNodesAtDepths[a.depth],
      y0: a.depth / totalNodesAtDepths.length,
      y1: (a.depth + 1) / totalNodesAtDepths.length
    }
  }),
  Tree.fold((a, bs) => [a, ...bs.flat()])
)

export {}
