import { pipe } from "fp-ts/lib/function"

function getOrDefault<
  Rec extends Record<string | number | symbol, unknown>,
  K extends keyof Rec,
  D
>(key: K, defaultValue: D) {
  return function (
    input: Rec
  ): K extends keyof Rec ? Rec[K] : D {
    return (key in input ? input[key] : defaultValue) as any
  }
}

pipe({ a: 1, b: 2 } as const, getOrDefault("|", 2))
