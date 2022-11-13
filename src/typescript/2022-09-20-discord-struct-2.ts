import { readonlyRecord as RR, struct as S } from "fp-ts";
import { pipe } from "fp-ts/function";

type T = { 
  a?: string
  b: number
}
declare const value: T
const result = pipe(
  value as RR.ReadonlyRecord<"a" | "b", string | number | undefined>,
  RR.mapWithIndex((k, v) => )
)