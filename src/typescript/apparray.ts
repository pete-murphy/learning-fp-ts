import * as A from "fp-ts/lib/Array"
import { sequenceT } from "fp-ts/lib/Apply"
import { Option, fold } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

sequenceT(A.array)([1, 2], [3, 4]) //?

const doubleFold = <A, B, C>([xOption, yOption]: [Option<A>, Option<B>]) => (
  onBothNone: () => C,
  onSomeNone: (a: A) => C,
  onNoneSome: (b: B) => C,
  onBothSome: (a: A, b: B) => C
): C =>
  pipe(
    xOption,
    fold(
      () =>
        pipe(
          yOption,
          fold(onBothNone, y => onNoneSome(y))
        ),
      x =>
        pipe(
          yOption,
          fold(
            () => onSomeNone(x),
            y => onBothSome(x, y)
          )
        )
    )
  )
