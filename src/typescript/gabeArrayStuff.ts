import * as R from "fp-ts/lib/Record"
import * as A from "fp-ts/lib/Array"
import { getFirstSemigroup } from "fp-ts/lib/Semigroup"

const arr = [1, 2, 3]
const modifier = 3

R.fromFoldableMap(getFirstSemigroup<number>(), A.array)([1, 2, 3], n => [
  `value-${n}`,
  n / modifier,
])
