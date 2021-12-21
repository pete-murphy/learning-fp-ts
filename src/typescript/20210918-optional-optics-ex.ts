import { pipe } from "fp-ts/function"
import * as Opt from "monocle-ts/Optional"
import * as L from "monocle-ts/Lens"
import { O } from "./ssstuff/fp-ts-imports"

type Foo = {
  readonly bar1: O.Option<{
    readonly baz: Record<string, number>
  }>
  readonly bar2: number
}

pipe(L.id<Foo>()).get

pipe(
  Opt.id<Foo>(),
  Opt.prop("bar1"),
  Opt.some,
  Opt.prop("baz"),
  Opt.key("quux")
).getOption
