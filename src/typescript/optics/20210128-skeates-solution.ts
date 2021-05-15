import { flow, pipe } from "fp-ts/lib/function"
import * as T from "monocle-ts/lib/Traversal"
import * as O from "fp-ts/lib/Option"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Ap from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"
import { Eq, eqNumber } from "fp-ts/lib/Eq"

type Example = Record<string, Record<string, number>>

const non = <A>({ equals }: Eq<A>) => (a: A) => <S>(
  sa: T.Traversal<S, O.Option<A>>
): T.Traversal<S, A> => ({
  modifyF: <F>(F: Ap.Applicative<F>) => (f: (a: A) => HKT<F, A>) =>
    sa.modifyF(F)(
      flow(
        O.getOrElse(() => a),
        f,
        fa => F.map(fa, b => (equals(a, b) ? O.none : O.some(b)))
      )
    ),
})

const setTo999 = pipe(
  T.id<Example>(),
  T.atKey("foo"),
  non(RR.getEq(eqNumber))(RR.empty),
  T.atKey("bar"),
  T.set(O.some(999))
)
setTo999({ foo: { bar: 1 } })
//-> { foo: { bar: 999 } }
setTo999({ foo: { baz: 1 } })
//-> { foo: { baz: 1, bar: 999 } }
setTo999({ baz: { bar: 1 } })
//-> { baz: { bar: 1 }, foo: { bar: 999 } }

const erase = pipe(
  T.id<Example>(),
  T.atKey("foo"),
  non(RR.getEq(eqNumber))(RR.empty),
  T.atKey("bar"),
  T.set<O.Option<number>>(O.none)
)
erase({ foo: { bar: 1 } })
//-> {}
erase({ foo: { baz: 1 } })
//-> { foo: { baz: 1 } }
erase({ baz: { bar: 1 } })
//-> { baz: { bar: 1 } }
