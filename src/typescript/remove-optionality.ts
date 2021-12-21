import { O, pipe } from "./ssstuff/fp-ts-imports"

type Result = {
  data: number
}
type Results = {
  activities?: Result
  albums?: Result
  artists?: Result
}

const mapOptionalData = <T extends keyof Results>(
  data: Results,
  key: T
): O.Option<NonNullable<Results[T]>["data"]> => {
  return pipe(
    O.fromNullable(data[key]),
    O.map(d => d.data)
  )
}

declare const results: Results
