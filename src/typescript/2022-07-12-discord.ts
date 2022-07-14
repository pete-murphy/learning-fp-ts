import {
  date,
  option,
  function as f,
  readonlyArray,
  readonlyNonEmptyArray,
  semigroup
} from "fp-ts"

const dates = [
  new Date(2020, 1, 1, 1, 1, 1, 1),
  new Date(2021, 1, 1, 1, 1, 1, 1),
  new Date()
] as const

const minD = f.pipe(
  dates,
  readonlyArray.foldMap(
    option.getMonoid(semigroup.min(date.Ord))
  )(option.of)
)

const minD_ = readonlyNonEmptyArray.concatAll(
  semigroup.min(date.Ord)
)(dates)
