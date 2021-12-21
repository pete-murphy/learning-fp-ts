import * as Mn from "fp-ts/Monoid"
import * as N from "fp-ts/number"
import * as O from "fp-ts/Option"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as RA from "fp-ts/ReadonlyArray"
import * as Sg from "fp-ts/Semigroup"
import * as St from "fp-ts/State"
import * as Strong from "fp-ts/Strong"
import * as Re from "fp-ts/Reader"
import { flow, identity, pipe, tuple } from "fp-ts/function"

// const scanLeft =

const scanLeftWithSemigroup = <A>(
  S: Sg.Semigroup<A>
): ((as: ReadonlyArray<A>) => ReadonlyArray<A>) =>
  flow(
    St.traverseArray(a =>
      flow(
        O.match(
          () => a,
          (a_: A) => S.concat(a, a_)
        ),
        a_ => [a_, O.some(a_)]
      )
    ),
    St.evaluate<O.Option<A>>(O.none)
  )

scanLeftWithSemigroup(N.SemigroupSum)([]) //?
scanLeftWithSemigroup(N.SemigroupSum)([1, 2, 3]) //?

pipe(
  [10, 20, 5, 100],
  RA.map(height => ({ height, totalHeight: height })),
  scanLeftWithSemigroup(
    Sg.struct({
      height: Sg.first(),
      totalHeight: N.SemigroupSum,
    })
  )
) //?

// scanMap f xs = evalState (traverse g xs) Nothing
//   where
//     g :: a -> State (Maybe m) m
//     g a = do
//       last <- get
//       let m = f a
//           next = liftA2 (<>) last (Just m)
//       put next
//       pure (fromMaybe m next)
// const monoidalScanMap =
//   <M>(M: Mn.Monoid<M>) =>
//   <A>(f: (a: A) => M): ((xs: ReadonlyArray<A>) => ReadonlyArray<M>) =>
//     flow(
//       St.traverseArray(a => (m: M) => {
//         const m_ = M.concat(m, f(m))
//         return tuple(m_, m_)
//       }),
//       St.evaluate(M.empty)
//     )

// const monoidalScan = <M>(M: Mn.Monoid<M>) => monoidalScanMap(M)((m: M) => m)

// monoidalScan(N.MonoidSum)([1, 2, 4])

// const sum = Mn.concatAll(N.MonoidSum)

// sum([1, 2, 3]) //?
// sum([]) //?

// export const sumWithoutStartWith = (input: number[]) =>
//   pipe(
//     input,
//     head,
//     match(
//       () => 0,
//       (h) =>
//         pipe(
//           input,
//           tail,
//           match(
//             () => h,
//             (t) => sum(h)(t)
//           )
//         )
//     )
//   );
