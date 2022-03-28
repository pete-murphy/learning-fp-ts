import { Applicative } from "fp-ts/lib/Applicative"
import { flow, pipe } from "fp-ts/lib/function"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  URIS,
  URIS2,
  URIS3
} from "fp-ts/lib/HKT"
import { PipeableTraverseWithIndex1 } from "fp-ts/TraversableWithIndex"
import * as Const from "fp-ts/Const"
import * as T from "fp-ts/Tree"
import * as A from "fp-ts/Array"
import * as NEA from "fp-ts/NonEmptyArray"
import Tree = T.Tree
import Forest = T.Forest
import URI = T.URI
import {
  Id,
  IO,
  Mn,
  N,
  Re,
  RT,
  RTup,
  Str
} from "./fp-ts-imports"
import {
  Functor,
  Functor1,
  Functor2,
  Functor3
} from "fp-ts/lib/Functor"
import { Foldable } from "fp-ts/lib/Foldable"
import {
  FoldableWithIndex,
  FoldableWithIndex1
} from "fp-ts/lib/FoldableWithIndex"
import * as Fr from "fp-ts-contrib/lib/Free"

export * from "fp-ts/Tree"

/**
 * An element of a Tree can be indexed by an array of integers representing the
 * indices of the forests in its path.
 */
export const traverseWithIndex: PipeableTraverseWithIndex1<
  URI,
  ReadonlyArray<number>
> = <F>(
  F: Applicative<F>
): (<A, B>(
  f: (ns: ReadonlyArray<number>, a: A) => HKT<F, B>
) => (ta: Tree<A>) => HKT<F, Tree<B>>) => {
  const sequenceF = A.sequence(F)
  const out =
    (ns: ReadonlyArray<number>) =>
    <A, B>(
      f: (ns: ReadonlyArray<number>, a: A) => HKT<F, B>
    ) =>
    (ta: Tree<A>): HKT<F, Tree<B>> =>
      F.ap(
        F.map(
          f(ns, ta.value),
          (value: B) => (forest: Forest<B>) => ({
            value,
            forest
          })
        ),
        pipe(
          A.zipWith(
            ta.forest,
            pipe(
              NEA.range(0, ta.forest.length),
              A.map(x => [...ns, x])
            ),
            (ta_, ns_) => out(ns_)(f)(ta_)
          ),
          sequenceF
        )
      )
  return out([])
}

export const mapWithIndex = traverseWithIndex(
  Id.Applicative
)

export const foldMapWithIndex = <M>(M: Mn.Monoid<M>) =>
  traverseWithIndex(Const.getApplicative(M))

// explore :: forall f g a b
//          . Functor f
//         => Functor g
//         => (forall x y. f (x -> y) -> g x -> y)
//         -> Free f (a -> b)
//         -> Cofree g a -> b

// Cofree g ~ Tree
//        g ~ List/Array
//
// explore :: forall f g a b
//          . Functor f
//         => (forall x y. f (x -> y) -> List x -> y)
//         -> Free f (a -> b)
//         -> Tree a -> b

// export function explore<F extends URIS3>(
//   F: Functor3<F>
// ): <R, E, A, B>(f: <X,Y>(fxy: Kind3<F, R, E, (_:X) => Y>, xs: Array<X>) => Y) => (fr: Fr.Free<F, (_:A) => B>) => (t: Tree<A>) => B
// function explore<F extends URIS2>(
//   F: Functor2<F>
// ): <E, A, B>(f: <X,Y>(fxy: Kind2<F, E, (_:X) => Y>, xs: Array<X>) => Y) => (fr: Fr.Free<F, (_:A) => B>) => (t: Tree<A>) => B
// function explore<F extends URIS>(
//   F: Functor1<F>
// ): <A, B>(f: <X,Y>(fxy: Kind<F, (_:X) => Y>, xs: Array<X>) => Y) => (fr: Fr.Free<F, (_:A) => B>) => (t: Tree<A>) => B
// function explore<F>(
//   F: Functor<F>
// ): <A, B>(f: <X,Y>(fxy: HKT<F, (_:X) => Y>, xs: Array<X>) => Y) => (fr: Fr.Free<F, (_:A) => B>) => (t: Tree<A>) => B
// {

// }

// function makeYoneda<F extends URIS3>(
//   F: Functor3<F>
// ): <R, E, A>(fa: Kind3<F, R, E, A>) => Yoneda<F, A>
// function makeYoneda<F extends URIS2>(
//   F: Functor2<F>
// ): <E, A>(fa: Kind2<F, E, A>) => Yoneda<F, A>
// function makeYoneda<F extends URIS>(
//   F: Functor1<F>
// ): <A>(fa: Kind<F, A>) => Yoneda<F, A>
// function makeYoneda<F>(
//   F: Functor<F>
// ): <A>(fa: HKT<F, A>) => Yoneda<F, A> {
//   return fa => run => F.map(fa, run)
// }

// const x = pipe(
//   T.unfoldTree(1, n => (n >= 4 ? [n, []] : [n, [n + 1, n + 2]])),
//   foldMapWithIndex(Str.Monoid)((ns, x) =>
//     Const.make(JSON.stringify(ns).concat(`:${x}, `))
//   )
// )

// x

// const exampleTree: Tree<string> = T.make("foo", [
//   T.make("bar", [T.make("bar-1"), T.make("bar-2"), T.make("bar-3")]),
//   T.make("baz", [
//     T.make("baz-1"),
//     T.make("baz-2"),
//     T.make("baz-3"),
//     T.make("baz-4"),
//     T.make("baz-5"),
//     T.make("baz-6"),
//   ]),
//   T.make("quux", [
//     T.make("quux-1"),
//     T.make("quux-2"),
//     T.make("quux-3"),
//     T.make("quux-4"),
//   ]),
//   T.make("quuz", [
//     T.make("quuz-1"),
//     T.make("quuz-2"),
//     T.make("quuz-3"),
//     T.make("quuz-4"),
//     T.make("quuz-5"),
//   ]),
// ])

// pipe(
//   exampleTree,
//   traverseWithIndex(IO.Applicative)((ns, x) =>
//     pipe(
//       () => {
//         console.log(ns)
//       },
//       IO.apSecond(() => {
//         console.log(x)
//       })
//     )
//   ),
//   f => f()
// )

// pipe(
//   exampleTree,
//   T.traverse(St.Applicative)((
//     str
//   ) => )
// )
