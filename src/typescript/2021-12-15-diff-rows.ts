import {
  Eq,
  N,
  O,
  pipe,
  RA,
  RR,
  Str,
  tuple,
} from "./ssstuff/fp-ts-imports"

type KeyValPairs<Rec extends Record<string, unknown>> = {
  [K in keyof Rec]: [K, Rec[K]]
}[keyof Rec]

export const diffRows =
  <
    K extends string,
    Rec extends Readonly<Record<K, unknown>>
  >(eqs: {
    [P in keyof Rec]: Eq.Eq<Rec[P]>
  }) =>
  (x: Rec, y: Rec): ReadonlyArray<KeyValPairs<Rec>> =>
    pipe(
      RR.keys(x),
      RA.filterMap(key =>
        eqs[key].equals(x[key], y[key])
          ? O.none
          : O.some(tuple(key, y[key]))
      )
    )

const ex0 = diffRows({
  foo: Str.Eq,
  bar: Str.Eq,
  baz: N.Eq,
})(
  { foo: "a", bar: "b", baz: 0 },
  { foo: "a", bar: "b", baz: 0 }
)

const ex1 = diffRows({
  foo: Str.Eq,
  bar: Str.Eq,
  baz: N.Eq,
})(
  { foo: "a", bar: "b", baz: 0 },
  { foo: "a", bar: "b", baz: 1 }
)

const ex2 = diffRows({
  foo: Str.Eq,
  bar: Str.Eq,
  baz: N.Eq,
})(
  { foo: "a", bar: "b", baz: 0 },
  { foo: "x", bar: "b", baz: 1 }
)

console.log({ ex0 })
console.log({ ex1 })
console.log({ ex2 })
