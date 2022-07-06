import { Forest } from "fp-ts/lib/Tree"
import {
  pipe,
  A,
  St,
  Tree,
  Sg,
  B,
  flow
} from "./lib/fp-ts-imports"

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

pipe(
  exampleTree,
  Tree.traverse(St.Applicative)(
    node => (path: ReadonlyArray<string>) =>
      [
        { node, path },
        [...path, node] as ReadonlyArray<string>
      ]
  ),
  St.evaluate<ReadonlyArray<string>>([]),
  Tree.map(JSON.stringify),
  Tree.drawTree
)

// {"node":"foo","path":[]}
// ├─ {"node":"bar","path":["foo"]}
// │  ├─ {"node":"bar-1","path":["foo","bar"]}
// │  ├─ {"node":"bar-2","path":["foo","bar","bar-1"]}
// │  └─ {"node":"bar-3","path":["foo","bar","bar-1","bar-2"]}
// ├─ {"node":"baz","path":["foo","bar","bar-1","bar-2","bar-3"]}
// │  ├─ {"node":"baz-1","path":["foo","bar","bar-1","bar-2","bar-3","baz"]}
// │  ├─ {"node":"baz-2","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1"]}
// │  ├─ {"node":"baz-3","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2"]}
// │  ├─ {"node":"baz-4","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3"]}
// │  ├─ {"node":"baz-5","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4"]}
// │  └─ {"node":"baz-6","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5"]}
// ├─ {"node":"quux","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6"]}
// │  ├─ {"node":"quux-1","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux"]}
// │  ├─ {"node":"quux-2","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1"]}
// │  ├─ {"node":"quux-3","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2"]}
// │  └─ {"node":"quux-4","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3"]}
// └─ {"node":"quuz","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4"]}
//    ├─ {"node":"quuz-1","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4","quuz"]}
//    ├─ {"node":"quuz-2","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4","quuz","quuz-1"]}
//    ├─ {"node":"quuz-3","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4","quuz","quuz-1","quuz-2"]}
//    ├─ {"node":"quuz-4","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4","quuz","quuz-1","quuz-2","quuz-3"]}
//    └─ {"node":"quuz-5","path":["foo","bar","bar-1","bar-2","bar-3","baz","baz-1","baz-2","baz-3","baz-4","baz-5","baz-6","quux","quux-1","quux-2","quux-3","quux-4","quuz","quuz-1","quuz-2","quuz-3","quuz-4"]}

pipe(
  exampleTree,
  Tree.fold<
    string,
    Tree.Tree<{ node: string; path: Array<string> }>
  >((x, xs) =>
    pipe(
      xs,
      A.map(
        Tree.map(({ node, path }) => ({
          node,
          path: [x, ...path]
        }))
      ),
      xs => Tree.make({ node: x, path: [] }, xs)
    )
  ),
  Tree.map(JSON.stringify),
  Tree.drawTree
)

// {"node":"foo","path":[]}
// ├─ {"node":"bar","path":["foo"]}
// │  ├─ {"node":"bar-1","path":["foo","bar"]}
// │  ├─ {"node":"bar-2","path":["foo","bar"]}
// │  └─ {"node":"bar-3","path":["foo","bar"]}
// ├─ {"node":"baz","path":["foo"]}
// │  ├─ {"node":"baz-1","path":["foo","baz"]}
// │  ├─ {"node":"baz-2","path":["foo","baz"]}
// │  ├─ {"node":"baz-3","path":["foo","baz"]}
// │  ├─ {"node":"baz-4","path":["foo","baz"]}
// │  ├─ {"node":"baz-5","path":["foo","baz"]}
// │  └─ {"node":"baz-6","path":["foo","baz"]}
// ├─ {"node":"quux","path":["foo"]}
// │  ├─ {"node":"quux-1","path":["foo","quux"]}
// │  ├─ {"node":"quux-2","path":["foo","quux"]}
// │  ├─ {"node":"quux-3","path":["foo","quux"]}
// │  └─ {"node":"quux-4","path":["foo","quux"]}
// └─ {"node":"quuz","path":["foo"]}
//    ├─ {"node":"quuz-1","path":["foo","quuz"]}
//    ├─ {"node":"quuz-2","path":["foo","quuz"]}
//    ├─ {"node":"quuz-3","path":["foo","quuz"]}
//    ├─ {"node":"quuz-4","path":["foo","quuz"]}
//    └─ {"node":"quuz-5","path":["foo","quuz"]}

const filterTree = <A>(
  predicate: (_: A) => boolean
): ((tree: Tree.Tree<A>) => Tree.Tree<A>) =>
  flow(
    Tree.extend(
      Tree.foldMap1(
        Sg.struct({
          node: Sg.first<A>(),
          hasMatchingDescendant: B.MonoidAny
        })
      )((node: A) => ({
        node,
        hasMatchingDescendant: predicate(node)
      }))
    ),
    tree =>
      Tree.make(
        tree.value,
        (function go(
          forest: Forest<{
            node: A
            hasMatchingDescendant: boolean
          }>
        ): Forest<{
          node: A
          hasMatchingDescendant: boolean
        }> {
          return Tree.unfoldForest(
            forest.filter(
              _ => _.value.hasMatchingDescendant
            ),
            _ => [_.value, go(_.forest)]
          )
        })(tree.forest)
      ),
    Tree.map(({ node }) => node)
  )

pipe(
  exampleTree,
  filterTree(node =>
    ["quuz-3", "quuz-2", "quux"].includes(node)
  ),
  Tree.map(JSON.stringify),
  Tree.drawTree
) //?

// "foo"
// ├─ "quux"
// └─ "quuz"
//    ├─ "quuz-2"
//    └─ "quuz-3"
