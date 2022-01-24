// Data types
import * as B from "fp-ts/boolean"
import * as Com from "fp-ts/Comonad"
import * as Dt from "fp-ts/Date"
import * as E from "fp-ts/Either"
import * as Fn from "fp-ts/function"
import * as IO from "fp-ts/IO"
import * as IOE from "fp-ts/IOEither"
import * as Id from "fp-ts/Identity"
import * as Mon from "fp-ts/Monad"
import * as NEA from "fp-ts/NonEmptyArray"
import * as N from "fp-ts/number"
import * as RA from "fp-ts/ReadonlyArray"
import * as RE from "fp-ts/ReaderEither"
import * as _RM from "fp-ts/ReadonlyMap"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RS from "fp-ts/ReadonlySet"
import * as RT from "fp-ts/ReaderTask"
import * as RTup from "fp-ts/ReadonlyTuple"
import * as Re from "fp-ts/Reader"
import * as Str from "fp-ts/String"
import * as St from "fp-ts/State"
import * as Strong from "fp-ts/Strong"
import * as Store from "fp-ts/Store"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import * as Th from "fp-ts/These"
import * as W from "fp-ts/Writer"

// Type classes
import * as Ap from "fp-ts/Apply"
import * as Apl from "fp-ts/Applicative"
import * as Eq from "fp-ts/Eq"
import * as Fld from "fp-ts/Foldable"
import * as Mn from "fp-ts/Monoid"
import * as Ord from "fp-ts/Ord"
import * as Sg from "fp-ts/Semigroup"
import * as Show from "fp-ts/Show"

// Utility
import {
  constant,
  flow,
  identity,
  pipe,
  tuple
} from "fp-ts/function"
import { not } from "fp-ts/Predicate"

import * as RM from "./ReadonlyMap"
import * as O from "./Option"
import * as RTE from "./ReaderTaskEither.ignore"
import * as Tree from "./Tree"
import * as RD from "./RemoteData.ignore"
import * as RNEA from "./ReadonlyNonEmptyArray"

export {
  Ap,
  Apl,
  B,
  Com,
  Dt,
  E,
  Eq,
  Fld,
  Fn,
  IO,
  IOE,
  Id,
  Mn,
  Mon,
  N,
  NEA,
  O,
  Ord,
  RA,
  RD,
  RM,
  RNEA,
  RR,
  RS,
  RT,
  RTE,
  RTup,
  RE,
  Re,
  Sg,
  Show,
  St,
  Strong,
  Store,
  Str,
  T,
  TE,
  Th,
  Tree,
  W,
  constant,
  flow,
  identity,
  not,
  pipe,
  tuple
}
