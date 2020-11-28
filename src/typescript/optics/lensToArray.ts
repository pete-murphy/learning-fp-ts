import * as A from "fp-ts/lib/Array"
import * as L from "monocle-ts/lib/Lens"
import * as I from "monocle-ts/lib/Iso"
import Lens = L.Lens
import Iso = I.Iso
import { pipe } from "fp-ts/lib/pipeable"

type S = { k1: Array<{ k2: string }> }

const k2Iso: Iso<Array<{ k2: string }>, Array<string>> = {
  get: A.map(x => x.k2),
  reverseGet: A.map(k2 => ({ k2 })),
}

const exampleLens: Lens<S, Array<string>> = pipe(
  L.id<S>(),
  L.prop("k1"),
  L.compose(I.asLens(k2Iso))
)

const exampleS: S = {
  k1: [{ k2: "foo" }, { k2: "bar" }, { k2: "baz" }],
}

exampleLens.get(exampleS)
//->  [ "foo", "bar", "baz" ]

exampleLens.set(["1", "2"])(exampleS)
//-> { k1: [ { k2: "1" }, { k2: "2" } ] }
