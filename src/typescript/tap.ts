import { pipe } from "fp-ts/lib/pipeable"
import { identity, flip, constant } from "fp-ts/lib/function"
import { apFirst, apSecond, io, IO } from "fp-ts/lib/IO"
import { compose } from "fp-ts/lib/Reader"
// import { apSecond, reader, ask } from "fp-ts/lib/Reader"

// const tap_ = <T>(f: (t: T) => void): ((t: T) => T) => t => {
//   f(t)
//   return t
// }

const tap = <T>(f: (t: T) => void) => (t: T): IO<T> =>
  apFirst(io.of(f(t)))(io.of(t))

// const tap2 = <T>(f: (t: T) => void) => (t: T): IO<T> =>
//   pipe(t, apFirst(io.of(f(t)))(io.of(t))

// io.ap(() => io.of("foo"), () => io.of("asdf"))() //?
// apSecond(io.of("asdf"))(io.of(""))() //?

tap(console.log)("foo")() //?
