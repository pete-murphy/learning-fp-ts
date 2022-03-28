import { constVoid, pipe } from "fp-ts/lib/function"
import { URLSearchParams } from "url"
import { O } from "./lib/fp-ts-imports"

type Input = {
  term: string
  limit: O.Option<number>
  type: ReadonlyArray<string>
  offset: O.Option<string>
}

function buildParams(input: Input) {
  const params = new URLSearchParams({
    term: input.term,
    limit: O.getOrElse(() => 5)(input.limit).toString(),
    type: input.type.join(",")
  })

  pipe(
    input.offset,
    O.fold(constVoid, offset =>
      params.append("offset", offset)
    )
  )

  return params
}
