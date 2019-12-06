import {
  RemoteData,
  success,
  pending,
  remoteData,
  alt,
  initial,
  getSemigroup,
  failure,
} from "@devexperts/remote-data-ts"
import { getLastSemigroup } from "fp-ts/lib/Semigroup"

remoteData.alt(success("a"), () => success("b")) //?
remoteData.alt(pending, () => success("b")) //?
remoteData.alt(pending, () => initial) //?

getSemigroup(getLastSemigroup<string>(), getLastSemigroup<string>()).concat(
  initial,
  pending
) //?
getSemigroup(getLastSemigroup<string>(), getLastSemigroup<string>()).concat(
  success("success"),
  failure("fail")
) //?
getSemigroup(getLastSemigroup<string>(), getLastSemigroup<string>()).concat(
  initial,
  pending
) //?

const S = getLastSemigroup<string>()

S.concat("a", "b") //?
S.concat("a", "b") //?
