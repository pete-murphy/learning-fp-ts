import * as Ap from "fp-ts/Apply"
import * as E from "fp-ts/Either"
import { flow, pipe } from "fp-ts/function"
import * as C from "parser-ts/char"
import { run } from "parser-ts/code-frame"
import * as S from "parser-ts/string"
import * as P from "parser-ts/Parser"
import * as O from "fp-ts/Option"
import * as RR from "fp-ts/ReadonlyRecord"
import * as IOTS from "io-ts"
import * as IOTST from "io-ts-types"

const P_Do: P.Parser<never, {}> = P.succeed({})
const P_apS = Ap.apS(P.parser)

const input: string = `
---
title: "Hello World!"
excerpt: "This is my first blog post."
createdAt: "2021-05-03"
---
`

type Frontmatter = {
  readonly title: string
  readonly createdAt: Date
  readonly author: string
  readonly excerpt: O.Option<string>
}

const dashes = S.string("---")
const colon = C.char(":")

const parserDate = (input: string): P.Parser<string, Date> =>
  pipe(
    input,
    IOTST.DateFromISOString.decode,
    E.match(_ => P.fail(), P.succeed)
  )

const parserField = <K extends keyof Frontmatter>(
  key: K,
  parser: (_: string) => P.Parser<string, Frontmatter[K]>
): P.Parser<string, Frontmatter[K]> =>
  pipe(
    S.string(key),
    P.chain(() => colon),
    P.chain(() => S.spaces),
    P.chain(() => S.doubleQuotedString),
    P.chain(parser)
  )

const parserFrontMatter: P.Parser<string, Frontmatter> = Ap.sequenceS(P.parser)(
  {
    title: parserField("title", S.string),
    createdAt: parserField("createdAt", parserDate),
    excerpt: parserField("excerpt", flow(S.string, P.optional)),
    author: parserField("author", S.string),
  }
)

run(parserFrontMatter, input) //?
