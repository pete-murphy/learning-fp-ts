import { flow, pipe } from "fp-ts/lib/function"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"
import * as Opt from "monocle-ts/lib/Optional"
import * as At from "monocle-ts/lib/At"
import * as O from "fp-ts/lib/Option"
import * as RR from "fp-ts/lib/ReadonlyRecord"
import * as Ap from "fp-ts/lib/Applicative"
import * as Tr from "fp-ts/lib/Traversable"
import { HKT } from "fp-ts/lib/HKT"

/**
 * can you use lenses or something similar to deal with defaults in records?
 * e.g. Record<KeyA, Record<KeyB, Data>>, I want to set the data for a [KeyA,
 * KeyB] pair even if it doesn’t already exist
 */

type KeyA = "fooA" | "barA" | "bazA"
type KeyB = "fooB" | "barB" | "bazB"
type Data = {
  someField: number
}

// type Example = Record<KeyA, Record<KeyB, Data>>
type Example = Record<string, Record<string, Data>>

const attempt1 = pipe(
  T.id<Example>(),
  T.key("fooA"),
  T.key("barB"),
  T.set({ someField: 0 })
)

const attempt2 = pipe(
  T.id<Example>(),
  T.atKey("fooA"),
  T.some,
  T.atKey("fooB"),
  T.set(O.some({ someField: 0 }))
)

const attempt3 = pipe(
  Opt.id<Example>(),
  Opt.atKey("fooA"),
  Opt.some,
  Opt.atKey("adsf"),
  Opt.modify(() => O.some({ someField: 3 }))
)

// const worded: T.Traversal<string, string> = {
//   modifyF: <F>(F: Applicative<F>) => (f: (str: string) => HKT<F, string>) =>
//     flow(
//       (str: string) => str.split(/\s+/),
//       traverse(F)(f),
//       fa => F.map(fa, ws => ws.join(" "))
//     ),
// }

const non = <A>(a: A) => <S>(
  sa: T.Traversal<S, O.Option<A>>
): T.Traversal<S, A> => ({
  modifyF: <F>(F: Ap.Applicative<F>) => (f: (a: A) => HKT<F, A>) =>
    sa.modifyF(F)(
      flow(
        O.fold(() => O.some(f(a)), flow(f, O.some)),
        O.sequence(F)
      )
    ),
})

// function traversalComposeTraversal<A, B>(ab: T.Traversal<A, B>): <S>(sa: T.Traversal<S, A>) => T.Traversal<S, B> {
//   return (sa) => ({
//     modifyF: <F>(F: Applicative<F>) => (f: (a: B) => HKT<F, B>) => sa.modifyF(F)(ab.modifyF(F)(f))
//   })
// }

// const some: <S, A>(soa: T.Traversal<S, O.Option<A>>) => T.Traversal<S, A> =
//   /*#__PURE__*/
//   traversalComposeTraversal(T.prismAsTraversal(T.prismSome()))

// ({
//   modifyF: <F>(F: Applicative<F>)  => (f: (a_: A) => HKT<F, A>) =>

// })
// (O.fold(() => O.some(a), O.some))
// non   :: Eq a => a -> Iso'   (Maybe a) a
// _Just ::              Prism' (Maybe a) a

// const atKey: (key: string) => <S, A>(sa: T.Traversal<S, Readonly<Record<string, A>>>) => T.Traversal<S, O.Option<A>>

// const some: <S, A>(soa: T.Traversal<S, O.Option<A>>) => T.Traversal<S, A>

const attempt4 = pipe(
  T.id<Example>(),
  T.atKey("fooA"),
  non<Record<string, Data>>(RR.empty),
  T.atKey("ffoobb"),
  T.set(O.some({ someField: 2 }))
)

const example: Example = {
  barA: {
    bazB: {
      someField: 1,
    },
  },
  // fooA: {}
}

attempt1(example) //?
attempt2(example) //?
attempt3(example) //?
attempt4(example) //?

// const x = pipe(Opt.id<Example>(), pipe(Opt.atKey("fooA"), Opt.compose()))
