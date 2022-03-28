export * from "fp-ts/lib/Option"

import * as RM from "fp-ts/lib/ReadonlyMap"
import * as Ord from "fp-ts/lib/Ord"
import * as Fld from "fp-ts/lib/Foldable"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as N from "fp-ts/lib/number"
import { pipe } from "fp-ts/lib/function"
import * as Eq from "fp-ts/lib/Eq"

export const toReadonlyArray = <A>(optA: O.Option<A>): ReadonlyArray<A> =>
  O.isNone(optA) ? [] : [optA.value]
