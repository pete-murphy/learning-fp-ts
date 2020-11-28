import * as L from "partial.lenses"

const input = [
  { name: "foo", amount: 10 },
  { name: "bar", amount: 20 },
]

const expected = [
  { name: "foo", amount: 10 },
  { name: "bar", amount: 15 },
  { name: "bar", amount: 5 },
]

// pipe(
//   L.id<ReadonlyArray<{name: string; amount: number}>>(),
//   L.traverse(RA.readonlyArray),
//   T.modify(x => [x])
// )

const divMod = (x, y) => [Math.floor(x / y), x % y]
const array = {
  map: (f, xs) => xs.map(f),
  of: x => [x],
  ap: (fab, fa) => fab.flatMap(ab => fa.map(ab)),
}

L.traverse(
  array,
  x => {
    const [n, r] = divMod(x.amount, 15)
    return Array(n)
      .fill({ ...x, amount: 15 })
      .concat({ ...x, amount: r })
  },
  L.elems,
  input
) //?
