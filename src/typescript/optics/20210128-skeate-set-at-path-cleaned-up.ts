import { flow, pipe } from "fp-ts/lib/function"
import * as Eq from "fp-ts/lib/Eq"
import * as T from "monocle-ts/lib/Traversal"
import * as O from "fp-ts/lib/Option"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Ap from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"

type Example = Record<string, Record<string, number>>

const non = <A>(eqA: Eq.Eq<A>, a: A) => <S>(
  sa: T.Traversal<S, O.Option<A>>
): T.Traversal<S, A> => ({
  modifyF: <F>(F: Ap.Applicative<F>) => (f: (a: A) => HKT<F, A>) =>
    sa.modifyF(F)(
      flow(
        O.fold(
          () => f(a),
          b => (eqA.equals(a, b) ? F.of(O.none) : O.some(f(a)))
        )
        // O.sequence(F)
      )
    ),
})

// modifyF :: Applicative f => (a -> f a) -> (s -> f s)

// const non = <A>(a: A) => <S>(
//   sa: T.Traversal<S, O.Option<A>>
// ): T.Traversal<S, A> => ({
//   modifyF: <F>(F: Ap.Applicative<F>) => (f: (a: A) => HKT<F, A>) =>
//     sa.modifyF(F)(
//       flow(
//         O.fold(() => O.some(f(a)), flow(f, O.some)),
//         O.sequence(F)
//       )
//     ),
// })

const fn = pipe(
  T.id<Example>(),
  T.atKey("foo"),
  non<Record<string, number>>(RR.getEq(Eq.eqNumber), RR.empty),
  T.atKey("bar"),
  // T.set(O.some(99999))
  T.set<O.Option<number>>(O.none)
)

fn({ baz: { bar: 99 } }) //?
//-> { foo: { bar: 999 } }

fn({ foo: { bar: 99 } }) //?
// //-> { foo: { baz: 1, bar: 999 } }

// fn({ baz: { bar: 1 } }) //?
// //-> { baz: { bar: 1 }, foo: { bar: 999 } }
