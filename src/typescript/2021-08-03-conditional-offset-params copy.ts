import { constVoid, pipe } from "fp-ts/lib/function"
import { URLSearchParams } from "url"
import { IO, O, RM, RR, Sg, TE } from "./lib/fp-ts-imports"
import * as Struct from "fp-ts/struct"
import * as uun from "fp-ts/void"
import * as Tr from "fp-ts/Tr"

type Input = {
  term: string
  limit: O.Option<number>
  type: ReadonlyArray<string>
  offset: O.Option<string>
  storefront: string
}

type Header = {
  Authorization: string
}

declare const makeAuthorizationHeader: IO.IO<Header>
declare const httpGet: (
  url: string,
  h: Header
) => TE.TaskEither<Error, string>
declare const decodeWith: (
  x: any
) => (s: string) => TE.TaskEither<Error, string>
declare const SearchResponseT: any

const M = RR.getUnionMonoid(O.getMonoid(Sg.first<string>()))
export const getSearch = (input: Input) =>
  pipe(
    {
      term: O.of(input.term),
      type: O.of(input.type.join(",")),
      limit: pipe(
        input.limit,
        O.alt(() => O.of(5)),
        O.map(n => n.toString())
      ),
      offset: input.offset
    },
    RR.compact,
    paramsObj => new URLSearchParams(paramsObj).toString(),
    paramsString =>
      httpGet(
        `http://some-url/search?${paramsString}`,
        makeAuthorizationHeader()
      ),
    TE.chain(decodeWith(SearchResponseT))
  )

// {
//   const params = new URLSearchParams({
//     term: input.term,
//     limit: O.getOrElse(() => 5)(input.limit).toString(),
//     type: input.type.join(","),
//   })

//   pipe(
//     input.offset,
//     O.fold(constVoid, offset => params.append("offset", offset))
//   )

//   // return params
// }
