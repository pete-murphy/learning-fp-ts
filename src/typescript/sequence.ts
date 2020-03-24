import { array } from "fp-ts/lib/Array"
import {
  either,
  right,
  left,
  fold,
  Either,
} from "fp-ts/lib/Either"
import {
  absurd,
  identity,
} from "fp-ts/lib/function"
import { IO } from "fp-ts/lib/IO"

const xs = array.sequence(either)([
  right(() => 1),
  left("foo"),
  right(absurd as () => number),
])

fold<string, Array<IO<number>>, void>(
  identity,
  fns => fns.forEach(fn => fn())
)(xs)

//?
