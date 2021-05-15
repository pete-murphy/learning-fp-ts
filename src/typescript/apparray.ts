import * as A from "fp-ts/lib/Array"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { sequenceT } from "fp-ts/lib/Apply"
import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import Option = O.Option

sequenceT(A.array)([1, 2], [3, 4]) //?

const doubleFold = <A, B, C>([xOption, yOption]: [Option<A>, Option<B>]) => (
  onBothNone: () => C,
  onSomeNone: (a: A) => C,
  onNoneSome: (b: B) => C,
  onBothSome: (a: A, b: B) => C
): C =>
  pipe(
    xOption,
    O.fold(
      () =>
        pipe(
          yOption,
          O.fold(onBothNone, y => onNoneSome(y))
        ),
      x =>
        pipe(
          yOption,
          O.fold(
            () => onSomeNone(x),
            y => onBothSome(x, y)
          )
        )
    )
  )

declare const maybeThing: Option<ReadonlyArray<number>>

const zzz = pipe(maybeThing, O.getOrElse(RA.zero))
zzz
