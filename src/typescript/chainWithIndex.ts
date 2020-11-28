import * as A from "fp-ts/lib/Array"

const chainWithIndex: <A, B>(
  fa: Array<A>,
  f: (i: number, a: A) => Array<B>
) => Array<B> = (fa, f) => fa.flatMap((a, i) => f(i, a))
