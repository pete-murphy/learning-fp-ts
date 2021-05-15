import * as Eq from "fp-ts/Eq"
import * as R from "fp-ts/Record"
import * as Sg from "fp-ts/Semigroup"
import * as A from "fp-ts/Array"
import { pipe } from "fp-ts/lib/function"

export const entries = <A extends Record<string, unknown>, K extends keyof A>(
  x: A
): Array<K extends keyof A ? [K, A[K]] : never> =>
  Object.entries(x) as Array<K extends keyof A ? [K, A[K]] : never>

type TagPoints = Record<string, Points>
type Points = {
  pointsAchieved: number
  pointsAvailable: number
}
const sgPoints = Sg.getStructSemigroup({
  pointsAvailable: Sg.semigroupSum,
  pointsAchieved: Sg.semigroupSum,
})

const tagPointSg_: Sg.Semigroup<TagPoints> = {
  concat: (x, y) => {
    return pipe(
      entries(x).concat(entries(y)),
      A.uniq(Eq.contramap(([x]: [string, Points]) => x)(Eq.eqString)),
      R.fromFoldable(sgPoints, A.array)
    )
  },
}
const tagPointSg: Sg.Semigroup<TagPoints> = R.getMonoid(sgPoints)

// {
//   concat: (x, y) => {
//     return pipe(
//       entries(x).concat(entries(y)),
//       A.uniq(Eq.contramap(([x]: [string, Points]) => x)(Eq.eqString)),
//       R.fromFoldable(sgPoints, A.array)
//     )
//   },
// }

const x: TagPoints = {
  foo: {
    pointsAchieved: 0,
    pointsAvailable: 0,
  },
}
const y: TagPoints = {
  foo: {
    pointsAchieved: 12,
    pointsAvailable: 20,
  },
}

const { concat } = tagPointSg

concat(x, concat(y, x)) //?
concat(concat(x, y), x) //?
