import * as A from "fp-ts/lib/Array"
import { Lens, Iso } from "monocle-ts"

type S = { k1: Array<{ k2: string }> }

const k2Iso: Iso<Array<{ k2: string }>, Array<string>> = new Iso(
  A.map(x => x.k2),
  A.map(k2 => ({ k2 }))
)

const exampleLens: Lens<S, Array<string>> = Lens.fromProp<S>()(
  "k1"
).compose(k2Iso.asLens())

const exampleS: S = {
  k1: [{ k2: "foo" }, { k2: "bar" }, { k2: "baz" }],
}

exampleLens.get(exampleS)
//->  [ "foo", "bar", "baz" ]

exampleLens.set(["1", "2"])(exampleS)
//-> { k1: [ { k2: "1" }, { k2: "2" } ] }
