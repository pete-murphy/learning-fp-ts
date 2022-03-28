import { match } from "../matchers.ignore"
import { Eq, Ord, pipe } from "../fp-ts-imports"

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
  _tag: "NegInf" as const,
}

export const finite = <A>(value: A) => ({
  _tag: "Finite" as const,
  value,
})

export const posInf = {
  _tag: "PosInf" as const,
}

const fold = match.on("_tag")

export const getOrd = <A>(
  ordA: Ord.Ord<A>
): Ord.Ord<Extended<A>> =>
  Ord.fromCompare((x, y) =>
    pipe(
      x,
      fold({
        NegInf: () =>
          pipe(
            y,
            fold({
              NegInf: () => 0,
              Finite: () => -1,
              PosInf: () => -1,
            })
          ),
        Finite: x_ =>
          pipe(
            y,
            fold({
              NegInf: () => 1,
              Finite: y_ =>
                ordA.compare(x_.value, y_.value),
              PosInf: () => -1,
            })
          ),
        PosInf: () =>
          pipe(
            y,
            fold({
              NegInf: () => 1,
              Finite: () => 1,
              PosInf: () => 0,
            })
          ),
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
      fold({
        NegInf: () => min,
        Finite: ({ value }) =>
          Ord.clamp(ordA)(min, max)(value),
        PosInf: () => max,
      })
    )
