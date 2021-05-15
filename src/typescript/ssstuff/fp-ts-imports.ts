// Data types
import * as B from "fp-ts/boolean"
import * as Dt from "fp-ts/Date"
import * as E from "fp-ts/Either"
import * as IO from "fp-ts/IO"
import * as IOE from "fp-ts/IOEither"
import * as Id from "fp-ts/Identity"
import * as NEA from "fp-ts/NonEmptyArray"
import * as N from "fp-ts/number"
import * as RA from "fp-ts/ReadonlyArray"
import * as _RM from "fp-ts/ReadonlyMap"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RS from "fp-ts/ReadonlySet"
import * as RT from "fp-ts/ReaderTask"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as RTup from "fp-ts/ReadonlyTuple"
import * as Re from "fp-ts/Reader"
import * as Str from "fp-ts/String"
import * as St from "fp-ts/State"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import * as Th from "fp-ts/These"
import * as Tree from "fp-ts/Tree"
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
import { constant, flow, identity, not, pipe, tuple } from "fp-ts/function"

import * as RM from "./ReadonlyMap"
import * as O from "./Option"

export {
  Ap,
  Apl,
  B,
  constant,
  Dt,
  E,
  Eq,
  Fld,
  flow,
  Id,
  IO,
  IOE,
  identity,
  Mn,
  N,
  NEA,
  not,
  O,
  Ord,
  pipe,
  RA,
  RM,
  RNEA,
  Re,
  RR,
  RS,
  RT,
  RTup,
  RTE,
  Str,
  St,
  Sg,
  Show,
  T,
  TE,
  Th,
  Tree,
  tuple,
  W,
}
