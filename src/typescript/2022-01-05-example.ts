import { pipe } from "fp-ts/lib/function"
import { O } from "./lib/fp-ts-imports"

type CustomPrize = {
  readonly type: "Custom"
}
type CatalogPrize = {
  readonly type: "Catalog"
}

// export function isPrizeType(
//   type: "Custom"
// ): (
//   prize: CustomPrize | CatalogPrize
// ) => prize is CustomPrize
// export function isPrizeType(
//   type: "Catalog"
// ): (
//   prize: CustomPrize | CatalogPrize
// ) => prize is CatalogPrize
// export function isPrizeType(
//   type: "Custom" | "Catalog"
// ): (
//   prize: CustomPrize | CatalogPrize
// ) => prize is CustomPrize | CatalogPrize {
//   return prize => prize.type === type
// }

// const isPrizeType =
//   (type: "Custom" | "Catalog") =>
//   (prize: CustomPrize | CatalogPrize) =>
//     prize.type === type

// const isCategory = isPrizeType("Custom") // asserts that prize is `CatalogPrize`

type Prize = CustomPrize | CatalogPrize
const isPrizeType =
  <K extends Prize["type"]>(type: K) =>
  (
    prize: Prize
  ): prize is Extract<Prize, Record<"type", K>> =>
    prize.type === type

console.log(isPrizeType("Custom")({ type: "Catalog" }))
console.log(isPrizeType("Custom")({ type: "Custom" }))

declare const prize: Prize

pipe(
  prize,
  O.fromPredicate(isPrizeType("Custom")),
  O.map(x => x)
)

//
