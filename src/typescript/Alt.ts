// tslint:disable: no-any
import { Alt, Alt1, Alt2, Alt2C, Alt3, Alt3C, Alt4 } from "fp-ts/lib/Alt"
import { tuple } from "fp-ts/lib/function"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/lib/HKT"

export function asumT<F extends URIS4>(
  F: Alt4<F>
): <S, R, E, T extends Array<Kind4<F, S, R, E, any>>>(
  ...t: T & { readonly 0: Kind4<F, S, R, E, any> }
) => Kind4<
  F,
  S,
  R,
  E,
  { [K in keyof T]: [T[K]] extends [Kind4<F, S, R, E, infer A>] ? A : never }
>
export function asumT<F extends URIS3>(
  F: Alt3<F>
): <R, E, T extends Array<Kind3<F, R, E, any>>>(
  ...t: T & { readonly 0: Kind3<F, R, E, any> }
) => Kind3<
  F,
  R,
  E,
  { [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never }
>
export function asumT<F extends URIS3, E>(
  F: Alt3C<F, E>
): <R, T extends Array<Kind3<F, R, E, any>>>(
  ...t: T & { readonly 0: Kind3<F, R, E, any> }
) => Kind3<
  F,
  R,
  E,
  { [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never }
>
export function asumT<F extends URIS2>(
  F: Alt2<F>
): <E, T extends Array<Kind2<F, E, any>>>(
  ...t: T & { readonly 0: Kind2<F, E, any> }
) => Kind2<
  F,
  E,
  { [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never }
>
export function asumT<F extends URIS2, E>(
  F: Alt2C<F, E>
): <T extends Array<Kind2<F, E, any>>>(
  ...t: T & { readonly 0: Kind2<F, E, any> }
) => Kind2<
  F,
  E,
  { [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never }
>
export function asumT<F extends URIS>(
  F: Alt1<F>
): <T extends Array<Kind<F, any>>>(
  ...t: T & { readonly 0: Kind<F, any> }
) => Kind<F, { [K in keyof T]: [T[K]] extends [Kind<F, infer A>] ? A : never }>
export function asumT<F>(
  F: Alt<F>
): <T extends Array<HKT<F, any>>>(
  ...t: T & { readonly 0: HKT<F, any> }
) => HKT<F, { [K in keyof T]: [T[K]] extends [HKT<F, infer A>] ? A : never }>
export function asumT<F>(F: Alt<F>): any {
  return <A>(...args: Array<HKT<F, A>>) => {
    const len = args.length
    const f = getTupleConstructor(len)
    let fas = F.map(args[0], f)
    for (let i = 1; i < len; i++) {
      fas = F.alt(fas, () => args[i])
    }
    return fas
  }
}

// tslint:disable-next-line: ban-types
function curried(f: Function, n: number, acc: ReadonlyArray<unknown>) {
  // tslint:disable-next-line: only-arrow-functions
  return function (x: unknown) {
    const combined = Array(acc.length + 1)
    for (let i = 0; i < acc.length; i++) {
      combined[i] = acc[i]
    }
    combined[acc.length] = x
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined)
  }
}

const tupleConstructors: Record<number, (a: unknown) => any> = {
  1: a => [a],
  2: a => (b: any) => [a, b],
  3: a => (b: any) => (c: any) => [a, b, c],
  4: a => (b: any) => (c: any) => (d: any) => [a, b, c, d],
  5: a => (b: any) => (c: any) => (d: any) => (e: any) => [a, b, c, d, e],
}

function getTupleConstructor(len: number): (a: unknown) => any {
  // eslint-disable-next-line no-prototype-builtins
  if (!tupleConstructors.hasOwnProperty(len)) {
    tupleConstructors[len] = curried(tuple, len - 1, [])
  }
  return tupleConstructors[len]
}
