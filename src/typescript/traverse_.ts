import { traverse_ } from "fp-ts/lib/Foldable"
import { io, IO } from "fp-ts/lib/IO"
import { either, left, right } from "fp-ts/lib/Either"
import { array } from "fp-ts/lib/Array"
import { option, some } from "fp-ts/lib/Option"

// traverse_(io, either)(left<string, string>("fooo"), str =>
//   io.of(console.log(str))
// )() //?
// traverse_(io, either)(right<string, string>("fooo"), str =>
//   io.of(console.log(str))
// )() //?

/**
 * traverse_ :: (Foldable t, Applicative f) => (a -> f b) -> t a -> f ()
 *
 * Map each element of a structure to an action, evaluate these actions from left to right, and ignore the results. For a version that doesn't ignore the results see traverse.
 *
 */
const foo1 = traverse_(io, option)(some("fooo"), (str) =>
  io.of(console.log(str))
)() //?
const foo2 = traverse_(io, array)([1, 2, 3], (str) =>
  io.of(console.log(str))
)() //?

const foo3 = array.traverse(io)([1, 2, 3], (str) =>
  io.of(console.log(str))
)() //?

const foo4 = array.traverse(io)([1, 2, 3], io.of)() //?

const foo5 = option.traverse(io)(some("str"), io.of)() //?

traverse_(io, option)(some("foo"), (s) => () =>
  console.log(s)
)

const foo: IO<string> = () => "string"
const foo_: IO<string> = io.of("string")

foo_() //?

// bitraverse_()
