import * as R from "ramda"

import * as T from "monocle-ts/Traversal"
import { pipe } from "fp-ts/function"

interface MyThing {
  readonly p?: string
}

const isNotNil = R.complement(R.isNil)

const pUpper = R.when(
  R.propSatisfies(isNotNil, "p"),
  R.over(R.lensProp("p"), R.toUpper)
)

const pUpper_ = R.over(R.lensProp("p"), R.toUpper)

const pExists: MyThing = { p: "work" }
console.log(pUpper(pExists))
console.log(pUpper_(pExists))

const pUpperM = pipe(
  T.id<{ p?: string }>(),
  T.prop("p"),
  T.fromNullable,
  T.modify(R.toUpper)
)

pUpperM({ p: "Sdf" }) //?
