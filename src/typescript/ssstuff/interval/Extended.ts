import { match } from "../matchers"
import { Ord, pipe } from "../fp-ts-imports"

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

export const getOrd = <A>(ordA: Ord.Ord<A>): Ord.Ord<Extended<A>> =>
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
              Finite: y_ => ordA.compare(x_.value, y_.value),
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
