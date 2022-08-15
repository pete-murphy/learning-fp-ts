import * as L from "monocle-ts/Lens"
import * as Op from "monocle-ts/Optional"
import * as Tr from "monocle-ts/Traversal"
import * as Pr from "monocle-ts/Prism"

import { O, pipe } from "./lib/fp-ts-imports"

type Thing = {
  foo: O.Option<boolean>
}

const thingWithNone: Thing = {
  foo: O.none
}
const thingWithSome: Thing = {
  foo: O.some(true)
}

// ------------
const ThingL = L.id<Thing>()
const ThingPr = Pr.id<Thing>()
const fooL = pipe(ThingL, L.prop("foo"))
const fooOp = pipe(ThingL, L.prop("foo"), L.some)
const fooPr = pipe(
  ThingL,
  L.prop("foo"),
  // L.composePrism(pipe(Pr.id<O.Option<boolean>>(), Pr.some))
  L.composePrism(pipe(Pr.id<O.Option<boolean>>(), Pr.some))
)

pipe(thingWithNone, fooL.set(O.some(false))) //?
pipe(thingWithNone, fooOp.set(false)) //?
pipe(thingWithNone, fooOp.set(false)) //?
pipe(thingWithNone, fooPr.set(true)) //?
pipe(thingWithNone, fooPr.set(true)) //?

pipe(thingWithSome, fooL.set(O.some(false))) //?
pipe(thingWithSome, fooOp.set(false)) //?
pipe(thingWithSome, fooPr.set(false)) //?
