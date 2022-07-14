import {
  date,
  option,
  function as f,
  monoid,
  semigroup,
  readonlyArray
} from "fp-ts"

const dates = [
  new Date(2020, 1, 1, 1, 1, 1, 1),
  new Date(2021, 1, 1, 1, 1, 1, 1),
  new Date()
] as const

const minD = f.pipe(
  dates,
  readonlyArray.map(option.of),
  monoid.concatAll(
    option.getMonoid(semigroup.min(date.Ord))
  )
)
