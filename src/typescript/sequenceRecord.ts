import { Apply1 } from "fp-ts/lib/Apply"
import { flow, pipe } from "fp-ts/lib/function"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as R from "fp-ts/lib/ReadonlyRecord"

const foo = flow(
  NEA.map(R.map(NEA.of)),
  NEA.fold(R.getMonoid(NEA.getSemigroup()))
)

foo([{ x: "a" }, { x: "b", y: "c" }]) //?

const ap: Apply1<R.URI>["ap"] = <A, B>(
  fab: Record<string, (a: A) => B>,
  fa: Record<string, A>
) => {
  let acc: Record<string, B> = {}
  for (const k in fab) {
    k in fa ? (acc[k] = fab[k](fa[k])) : void 0
  }
  return acc
}

// Specializing to `NonEmptyArray` for simplicity, but this *could* be generalized
// to any `TraversableNonEmpty` if that were a type class in `fp-ts`. It would
// be similar to the `Traversable1` type class in PureScript. Confusingly, there
// *is* already a `Traversable1` in `fp-ts` but it doesn't refer to the same thing (it is a specialization of the
// `Traversable` class to
// const sequenceNonEmpty = <A, R extends Record<string, A>, K extends keyof R>(
//   ta: NEA.ReadonlyNonEmptyArray<R>
// ): Record<K, NEA.ReadonlyNonEmptyArray<A>> =>
const sequenceNonEmpty = <A>(
  ta: NEA.ReadonlyNonEmptyArray<Record<string, A>>
): Record<string, NEA.ReadonlyNonEmptyArray<A>> =>
  pipe(ta, NEA.uncons, ([a, as]) =>
    pipe(
      as,
      A.reduce(pipe(a, R.map(NEA.of)), (fas, fa) =>
        ap(
          pipe(
            fas,
            R.map(as_ => (a_: A) => NEA.snoc(as_, a_))
          ),
          fa
        )
      )
    )
  )

sequenceNonEmpty([{ x: "a" }, { x: "b", y: "c" }]) //?
