import { pipe } from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as FS from "io-ts/FreeSemigroup"

const exampleFS: FS.FreeSemigroup<number> = FS.concat(
  FS.concat(FS.of(1), FS.concat(FS.of(2), FS.of(3))),
  FS.concat(FS.concat(FS.of(4), FS.of(5)), FS.of(6))
)

const fsToArray = <A>(fs: FS.FreeSemigroup<A>): ReadonlyArray<A> =>
  pipe(
    fs,
    FS.fold(RA.of, (left, right) =>
      RA.getMonoid<A>().concat(fsToArray(left), fsToArray(right))
    )
  )

fsToArray(exampleFS)
//-> [ 1, 2, 3, 4, 5, 6 ]
