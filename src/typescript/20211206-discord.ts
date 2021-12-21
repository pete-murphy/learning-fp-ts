import { constant, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as AR from "fp-ts/Array"
import * as T from "monocle-ts/Traversal"
import * as Opt from "monocle-ts/Optional"
import * as Pr from "monocle-ts/Prism"

type Something = { field: string; values: O.Option<{ field: string }>[] }

declare const value: O.Option<Something>
const ref = "someValue"
// const x = pipe(
//   O.Do,
//   O.apS('value', value),
//   // O.bind('matchingValue', ({value}) =)
//   // value,
//   // O.chain(({ values }) =>
//   //   pipe(values, AR.findFirst(O.exists(({ field }) => field === ref)))
//   // ),
//   // O.flatten
// )

const x = pipe(
  value,
  O.chain(({ values }) =>
    pipe(values, AR.findFirst(O.exists(({ field }) => field === ref)))
  ),
  O.flatten
)

const x_ = pipe(
  pipe(
    Opt.id<O.Option<Something>>(),
    Opt.some,
    Opt.prop("values")
    // Opt.findFirst()
    // Opt.findFirst(O.exists(({ field }) => field === ref)),
    // Opt.some
    // Pr.some,
  ),
  Opt.findFirst((x): x is typeof x =>
    pipe(
      x,
      O.exists(({ field }) => field === ref)
    )
  )
)
