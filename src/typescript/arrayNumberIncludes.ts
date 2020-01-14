import { fromFoldable } from "fp-ts/lib/Record"
import { array, getMonoid } from "fp-ts/lib/Array"
import { getFirstSemigroup } from "fp-ts/lib/Semigroup"

const xs = [{ key: "foo", val: "bar" }]

fromFoldable(array)(
  xs.map(
    ({ key, val }): [string, V] => [key, val],
    (x, _) => x
  )
)
