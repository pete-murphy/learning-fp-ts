import { Int } from "io-ts"
import { date, NonEmptyString, UUID } from "io-ts-types"
import * as D from "io-ts/lib/Decoder"
import { pipe } from "fp-ts/lib/pipeable"

import { AppSchemable2C } from "./AppSchemable"
import { fromDecoder, GuardSchemable } from "./GuardSchemable"
import { isNonEmptyString } from "./monorail/guards"
import { fromNullable } from "fp-ts/lib/Option"

export const DecoderSchemable: AppSchemable2C<D.URI, unknown> = {
  ...D.Schemable,
  ...D.WithRefine,
  ...D.WithUnion,
  ...D.WithUnknownContainers,
  nonEmptyString: pipe(
    D.string,
    D.refine((u): u is NonEmptyString => isNonEmptyString(u), "NonEmptyString")
  ),
  date: D.fromGuard(date, `Date`),
  int: D.fromGuard(Int, `Int`),
  uuid: D.fromGuard(UUID, `Uuid`),
  unknown: D.fromGuard(GuardSchemable.unknown, `unknown`),
  newtype: (from, iso) => pipe(from, D.map(iso.wrap)),
  option: value =>
    D.fromGuard(GuardSchemable.option(fromDecoder(value)), `Option`),
  optionFromNullable: from => pipe(from, D.map(fromNullable)),
  set: value => D.fromGuard(GuardSchemable.set(fromDecoder(value)), `Set`),
}
