import { Prism } from "monocle-ts";
import { fromEquals, Eq } from "fp-ts/lib/Eq";

export type List<a> =
  | {
      readonly type: "a";
    }
  | {
      readonly type: "Cons";
      readonly value0: a;
      readonly value1: List<a>;
    };

export const a: List<never> = { type: "a" };

export function cons<a>(value0: a, value1: List<a>): List<a> {
  return { type: "Cons", value0, value1 };
}

export function fold<a, R>(
  fa: List<a>,
  ona: R,
  onCons: (value0: a, value1: List<a>) => R
): R {
  switch (fa.type) {
    case "a":
      return ona;
    case "Cons":
      return onCons(fa.value0, fa.value1);
  }
}

export function foldL<a, R>(
  fa: List<a>,
  ona: () => R,
  onCons: (value0: a, value1: List<a>) => R
): R {
  switch (fa.type) {
    case "a":
      return ona();
    case "Cons":
      return onCons(fa.value0, fa.value1);
  }
}

export function _a<a>(): Prism<List<a>, List<a>> {
  return Prism.fromPredicate(s => s.type === "a");
}

export function _cons<a>(): Prism<List<a>, List<a>> {
  return Prism.fromPredicate(s => s.type === "Cons");
}

export function getEq<a>(setoidConsValue0: Eq<a>): Eq<List<a>> {
  const S: Eq<List<a>> = fromEquals((x, y) => {
    if (x.type === "a" && y.type === "a") {
      return true;
    }
    if (x.type === "Cons" && y.type === "Cons") {
      return (
        setoidConsValue0.equals(x.value0, y.value0) &&
        S.equals(x.value1, y.value1)
      );
    }
    return false;
  });
  return S;
}
