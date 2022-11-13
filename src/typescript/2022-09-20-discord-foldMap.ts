// If I have a T[] and I'd like to have { t1: T1[], t2: T2[], t3: T3[] } and I have three functions:
// T => T1
// T => T2
// T => T3

import { readonlyArray as RA, monoid as Mn } from "fp-ts";
import { pipe } from "fp-ts/function";

declare const ts: T[];
declare const f: (t: T) => T1;
declare const g: (t: T) => T2;
declare const h: (t: T) => T3;

pipe(
  ts,
  RA.foldMap(
    Mn.struct({
      t1: RA.getMonoid<T1>(),
      t2: RA.getMonoid<T2>(),
      t3: RA.getMonoid<T3>()
    })
  )(t => ({
    t1: [f(t)],
    t2: [g(t)],
    t3: [h(t)]
  }))
);

interface T {}
interface T1 {}
interface T2 {}
interface T3 {}
