import { pipe, TE, RTE } from "./lib/fp-ts-imports"

type Flat<X> = never
type Nest<O, I> = never

abstract class Nested<FS, A> {
  readonly _A!: () => A
  readonly _FS!: () => FS
}

// class Flat_<X> extends Nested<Flat<F>, >
