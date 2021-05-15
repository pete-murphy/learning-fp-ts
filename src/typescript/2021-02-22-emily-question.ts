import { pipe } from "fp-ts/lib/function"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"

type A = { x: string; y?: { z: string } }
type B = { x: string; y?: { z: string } }
type C = { pinto: string }
type AB = A | B
const isAB = (t: A | B | C): t is AB => "y" in t
const a: A = { x: "this is x", y: { z: "this is y" } }
const b: B = { x: "this is x", y: { z: "this is y" } }
const c: C = { pinto: "this is a bean" }
const abItems: Array<AB> = pipe(
  [a, b, c],
  A.filterMap(O.fromPredicate(isAB)),
  A.map(item => ({ ...item, y: item.y ? item.y : undefined }))
)
