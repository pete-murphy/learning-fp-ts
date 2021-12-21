import * as Gr from "fp-ts/Group"
import { match as tsMatch } from "ts-pattern"
import { tuple } from "./fp-ts-imports"
import { match } from "./matchers.ignore"
// import { match } from "./matchers"

export type PNString = {
  readonly tag: "positive" | "negative"
  readonly value: string
}

export const positive = (value: string): PNString => ({
  tag: "positive" as const,
  value,
})

export const negative = (value: string): PNString => ({
  tag: "negative" as const,
  value,
})

// @NOTE - Pete Murphy 2021-09-11 - This is not a valid Group
// but it *seems* like maybe you could make a valid group out of
// this somehow?
export const groupPNString: Gr.Group<PNString> = {
  concat: (x, y) =>
    tsMatch(tuple(x, y))
      .with(
        [{ tag: "positive" }, { tag: "positive" }],
        ([x, y]) => positive(x.value.concat(y.value))
      )
      .with(
        [{ tag: "negative" }, { tag: "negative" }],
        ([x, y]) => negative(x.value.concat(y.value))
      )
      .with(
        [{ tag: "negative" }, { tag: "positive" }],
        ([x, y]) => positive(y.value.replace(x.value, ""))
      )
      .with(
        [{ tag: "positive" }, { tag: "negative" }],
        ([x, y]) => positive(x.value.replace(y.value, ""))
      )
      .exhaustive(),
  empty: negative(""),
  inverse: match({
    negative: ({ value }) => positive(value),
    positive: ({ value }) => negative(value),
  }),
}
