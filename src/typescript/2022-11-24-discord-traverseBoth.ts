import * as L from "monocle-ts/Lens";
import * as T from "monocle-ts/Traversal";
import { readonlyArray as RA } from "fp-ts";

// Hi, I wrote the following function

// const traverseBoth = <S, A>(t: Lens<S, readonly [A, A]>): Traversal<S, A> =>
//     lens.traverse(A.Traversable)(
//         // is this safe to do?
//         t as unknown as Lens<S, ReadonlyArray<A>>
//     );

// but unfortunately it needs a typecast. I like that it makes the implementation trivial, but I am not sure it is safe to do.
// Can I make this cast without causing runtime errors down the line?

const traverseBoth_ = <S, A, Tup extends ReadonlyArray<A>>(
  t: L.Lens<S, Tup>,
): T.Traversal<S, A> =>
  L.traverse(RA.Traversable)(
    // @ts-expect-error
    t,
  );

type A = {};
type S = { readonly tuple: readonly [A, A] };
declare const t: L.Lens<S, A>;

// const traverseBoth: <S, A>(t: L.Lens<S, readonly [A, A]>) => T.Traversal<S, A> = L.traverse(RA.Traversable)(t)
// // const traverseBoth = <S, A>(
// //   t: L.Lens<S, ReadonlyArray<A>>,
// // ): T.Traversal<S, A> => L.traverse(RA.Traversable)(t);

const tupleLens = L.traverse(t);
