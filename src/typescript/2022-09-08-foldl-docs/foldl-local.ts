import * as L from "fp-ts-foldl";
import * as RA from "fp-ts/ReadonlyArray";

export * from "fp-ts-foldl";

/**
 * @since 0.1.0
 * @category Instance operations
 */
export const of_ =
  <E = never, A = never>(a: A): L.Fold =>
  (run: any) =>
    run({
      step: (x: any) => x,
      begin: undefined as never,
      done: () => a
    });

// export function foldArrayRev<A, Out>(
//   a: L.Fold<A, Out>
// ): (_: ReadonlyArray<A>) => Out;
// export function foldArrayRev<A, A_, B, Out>(
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, Out>,
//   a: L.Fold<A, A_>
// ): (_: ReadonlyArray<B>) => Out;
// export function foldArrayRev<A, A_, B, B_, C, Out>(
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, Out>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   a: L.Fold<A, A_>
// ): (_: ReadonlyArray<C>) => Out;
// export function foldArrayRev<A, A_, B, B_, C, C_, D, Out>(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, Out>
// ): (_: ReadonlyArray<D>) => Out;
// export function foldArrayRev<A, A_, B, B_, C, C_, D, D_, E, Out>(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, D_>,
//   de: (d: L.Fold<D, D_>) => L.Fold<E, Out>
// ): (_: ReadonlyArray<E>) => Out;
// export function foldArrayRev<A, A_, B, B_, C, C_, D, D_, E, E_, F, Out>(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, D_>,
//   de: (d: L.Fold<D, D_>) => L.Fold<E, E_>,
//   ef: (e: L.Fold<E, E_>) => L.Fold<F, Out>
// ): (_: ReadonlyArray<F>) => Out;
// export function foldArrayRev<A, A_, B, B_, C, C_, D, D_, E, E_, F, F_, G, Out>(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, D_>,
//   de: (d: L.Fold<D, D_>) => L.Fold<E, E_>,
//   ef: (e: L.Fold<E, E_>) => L.Fold<F, F_>,
//   fg: (f: L.Fold<F, F_>) => L.Fold<G, Out>
// ): (_: ReadonlyArray<G>) => Out;
// export function foldArrayRev<
//   A,
//   A_,
//   B,
//   B_,
//   C,
//   C_,
//   D,
//   D_,
//   E,
//   E_,
//   F,
//   F_,
//   G,
//   G_,
//   H,
//   Out
// >(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, D_>,
//   de: (d: L.Fold<D, D_>) => L.Fold<E, E_>,
//   ef: (e: L.Fold<E, E_>) => L.Fold<F, F_>,
//   fg: (f: L.Fold<F, F_>) => L.Fold<G, G_>,
//   gh: (f: L.Fold<G, G_>) => L.Fold<H, Out>
// ): (_: ReadonlyArray<H>) => Out;
// export function foldArrayRev<
//   A,
//   A_,
//   B,
//   B_,
//   C,
//   C_,
//   D,
//   D_,
//   E,
//   E_,
//   F,
//   F_,
//   G,
//   G_,
//   H,
//   H_,
//   I,
//   Out
// >(
//   a: L.Fold<A, A_>,
//   ab: (a: L.Fold<A, A_>) => L.Fold<B, B_>,
//   bc: (b: L.Fold<B, B_>) => L.Fold<C, C_>,
//   cd: (c: L.Fold<C, C_>) => L.Fold<D, D_>,
//   de: (d: L.Fold<D, D_>) => L.Fold<E, E_>,
//   ef: (e: L.Fold<E, E_>) => L.Fold<F, F_>,
//   fg: (f: L.Fold<F, F_>) => L.Fold<G, G_>,
//   gh: (f: L.Fold<G, G_>) => L.Fold<H, H_>,
//   hi: (f: L.Fold<H, H_>) => L.Fold<I, Out>
// ): (_: ReadonlyArray<H>) => Out;
// /* eslint-disable prefer-rest-params */
// export function foldArrayRev(
//   // a: unknown,
//   // ab?: Function,
//   // bc?: Function,
//   // cd?: Function,
//   // de?: Function,
//   // ef?: Function,
//   // fg?: Function,
//   // gh?: Function,
//   // hi?: Function
//   ...argsO: { 0: unknown } & Array<Function>
// ): unknown {
//   const args = argsO.reverse();
//   const [a, ab, bc, cd, de, ef, fg, gh, hi] = args;
//   const f: any = L.fold(RA.Foldable);
//   switch (args.length) {
//     case 1:
//       return f(a);
//     case 2:
//       return f(ab!(a));
//     case 3:
//       return f(bc!(ab!(a)));
//     case 4:
//       return f(cd!(bc!(ab!(a))));
//     case 5:
//       return f(de!(cd!(bc!(ab!(a)))));
//     case 6:
//       return f(ef!(de!(cd!(bc!(ab!(a))))));
//     case 7:
//       return f(fg!(ef!(de!(cd!(bc!(ab!(a)))))));
//     case 8:
//       return f(gh!(fg!(ef!(de!(cd!(bc!(ab!(a))))))));
//     case 9:
//       return f(hi!(gh!(fg!(ef!(de!(cd!(bc!(ab!(a)))))))));
//     default: {
//       let ret = arguments[0];
//       for (let i = 1; i < arguments.length; i++) {
//         ret = arguments[i](ret);
//       }
//       return f(ret);
//     }
//   }
// }
// /* eslint-enable prefer-rest-params */
