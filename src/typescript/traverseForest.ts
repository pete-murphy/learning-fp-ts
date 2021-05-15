import * as Tree from "fp-ts/lib/Tree"
import * as St from "fp-ts/lib/State"
import * as Ap from "fp-ts/lib/Applicative"
import * as Tr from "fp-ts/lib/Traversable"
import * as A from "fp-ts/lib/Array"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { pipe } from "fp-ts/lib/function"

const forest: Tree.Forest<string> = [
  {
    value: "1",
    forest: [
      {
        value: "1a",
        forest: [],
      },
      {
        value: "1b",
        forest: [],
      },
    ],
  },
  {
    value: "2",
    forest: [
      {
        value: "2a",
        forest: [
          {
            value: "2a1",
            forest: [],
          },
          {
            value: "2a1",
            forest: [],
          },
        ],
      },
      {
        value: "2b",
        forest: [],
      },
    ],
  },
]

const t1 = Tree.make({ val: "a" }, [
  Tree.make({ val: "b" }, [
    Tree.make({ val: "b1" }, [Tree.make({ val: "b1-2" })]),
    Tree.make({ val: "b2" }),
    Tree.make({ val: "b3" }),
  ]),
  Tree.make({ val: "c" }),
])

const f_ = (x: { val: string }) =>
  pipe(
    St.get<Array<string>>(),
    St.chainFirst(n => {
      n
      return St.put(n.concat(x.val))
    }),
    St.map(path => {
      path
      x
      return { path, x }
    })
  )

const foo_1 = pipe(
  Tree.traverse(St.Applicative)(f_)(t1),
  St.evaluate([""]),
  n => JSON.stringify(n, null, 2)
) //?

const f = (frst: Tree.Forest<string>) =>
  pipe(
    frst,
    St.traverseArray(x =>
      pipe(
        St.modify(z => `${z}-${x.value}`),
        St.chain(St.get)
      )
    )
  )

f(forest)(10) //?

// const g = Tree.

const postIncrement: St.State<{ value: number }, number> = ({ value }) => [
  value + 1,
  { value },
]

const postIncrement_: St.State<{ value: number }, number> = pipe(
  St.get<{ value: number }>(),
  St.chainFirst(() => St.modify(x => ({ value: x.value + 1 }))),
  St.map(({ value }) => value)
)

const postIncrement__: St.State<{ value: number }, number> = pipe(
  St.gets((x: { value: number }) => x.value),
  St.chainFirst(() => St.modify(x => ({ value: x.value + 1 })))
)

const postIncrement___: St.State<{ value: number }, number> = pipe(
  St.gets((x: { value: number }) => x.value),
  St.apFirst(St.modify(x => ({ value: x.value + 1 })))
)

// ***************** Map with index?

const t2 = Tree.make({ val: "a" }, [
  Tree.make({ val: "b" }, [
    Tree.make({ val: "b1" }, [Tree.make({ val: "b1-2" })]),
    Tree.make({ val: "b2" }),
    Tree.make({ val: "b3" }),
  ]),
  Tree.make({ val: "c" }),
])

// export const map: <A, B>(f: (a: A) => B) => (fa: Tree<A>) => Tree<B> = (f) => (fa) => ({
//   value: f(fa.value),
//   forest: fa.forest.map(map(f))
// })

// const mapWithIndex: <A, B>(
//   f: (i: number, a: A) => B
// ) => (fa: Tree.Tree<A>) => Tree.Tree<B> = f => fa => ({
//   value: f(),
// })

// const x = Tree.unfoldForest([100], n => [n, n == 0 ? [] : [n-1]]) //?
// JSON.stringify(x,null,2) //?
