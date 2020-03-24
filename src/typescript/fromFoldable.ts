import * as R from "fp-ts/lib/Record"
import { array } from "fp-ts/lib/Array"
import { getFoldableComposition } from "fp-ts/lib/Foldable"
import { getFirstSemigroup } from "fp-ts/lib/Semigroup"

R.fromFoldable(
  getFirstSemigroup<string>(),
  getFoldableComposition(array, array)
)([[["a", "b"]]])
