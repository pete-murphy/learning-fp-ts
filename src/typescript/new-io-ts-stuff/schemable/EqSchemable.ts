import * as E from "io-ts/lib/Eq"
import * as R from "ramda"
import { Eq, eqDate, eqStrict } from "fp-ts/lib/Eq"
import * as O from "fp-ts/lib/Option"
import * as S from "fp-ts/lib/ReadonlySet"

import { AppSchemable1 } from "./AppSchemable"

const deepEqualsEq = {
  equals: R.equals,
}

export const EqSchemable: AppSchemable1<E.URI> = {
  ...E.Schemable,
  nonEmptyString: eqStrict,
  date: eqDate,
  int: eqStrict,
  uuid: eqStrict,
  option: O.getEq,
  set: S.getEq,
  union: (...members) => ({
    equals: (a, b) => members.some(tryEq(a, b)),
  }),
  refine: refinement => from => ({
    equals: (a, b) => refinement(a) && refinement(b) && from.equals(a, b),
  }),
  newtype: (from, _iso) => from,
  UnknownArray: deepEqualsEq,
  UnknownRecord: deepEqualsEq,
  unknown: deepEqualsEq,
}

// Defense against invalid property access by an Eq receiving an invalid type
function tryEq(a: unknown, b: unknown) {
  return (eq: Eq<unknown>) => {
    try {
      return eq.equals(a, b)
    } catch {
      return false
    }
  }
}
