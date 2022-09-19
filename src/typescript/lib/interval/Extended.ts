import { Eq, Ord, pipe } from "../fp-ts-imports"
import { makeMatch } from "ts-adt/MakeADT"
import { Ordering } from "fp-ts/Ordering"

const match = makeMatch("_tag")

export type Extended<A> =
  | {
      readonly _tag: "NegInf"
    }
  | {
      readonly _tag: "Finite"
      readonly value: A
    }
  | {
      readonly _tag: "PosInf"
    }

export const negInf = {
  _tag: "NegInf" as const
}

export const finite = <A>(value: A) => ({
  _tag: "Finite" as const,
  value
})

export const posInf = {
  _tag: "PosInf" as const
}

export const getOrd = <A>(
  ordA: Ord.Ord<A>
): Ord.Ord<Extended<A>> =>
  Ord.fromCompare((x, y) =>
    pipe(
      x,
      match({
        NegInf: () =>
          pipe(
            y,
            match({
              NegInf: (): Ordering => 0,
              Finite: (): Ordering => -1,
              PosInf: (): Ordering => -1
            })
          ),
        Finite: x_ =>
          pipe(
            y,
            match({
              NegInf: (): Ordering => 1,
              Finite: y_ =>
                ordA.compare(x_.value, y_.value),
              PosInf: (): Ordering => -1
            })
          ),
        PosInf: () =>
          pipe(
            y,
            match({
              NegInf: (): Ordering => 1,
              Finite: (): Ordering => 1,
              PosInf: (): Ordering => 0
            })
          )
      })
    )
  )

export const getEq = <A>(
  eqA: Eq.Eq<A>
): Eq.Eq<Extended<A>> =>
  Eq.fromEquals((x, y) =>
    x._tag === "Finite" && y._tag === "Finite"
      ? eqA.equals(x.value, y.value)
      : x._tag === y._tag
  )

export const clampFinite =
  <A>(ordA: Ord.Ord<A>) =>
  (min: A, max: A) =>
  (exA: Extended<A>): A =>
    pipe(
      exA,
      match({
        NegInf: () => min,
        Finite: ({ value }) =>
          Ord.clamp(ordA)(min, max)(value),
        PosInf: () => max
      })
    )
