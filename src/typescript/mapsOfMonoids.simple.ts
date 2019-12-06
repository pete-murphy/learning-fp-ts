import * as M from "fp-ts/lib/Map"
import {
  RemoteData,
  success,
  remoteData,
  map,
  fold,
} from "@devexperts/remote-data-ts"
import { sequenceS } from "fp-ts/lib/Apply"
import { getObjectSemigroup } from "fp-ts/lib/Semigroup"
import { eqNumber, Eq, getStructEq, eqString } from "fp-ts/lib/Eq"
import { pipe } from "fp-ts/lib/pipeable"
import { array } from "fp-ts/lib/Array"

type UniqueId = { group: string; index: number }
const eqUniqueId: Eq<UniqueId> = getStructEq({
  group: eqString,
  index: eqNumber,
})

const exampleId: UniqueId = { group: "a", index: 1 }

type User = {
  name: string
  age: number
  email: string
}

type Response<T> = RemoteData<{}, Array<[UniqueId, T]>>

const namesSuccess: Response<{ name: string }> = success([
  [exampleId, { name: "Pete" }],
])
const agesSuccess: Response<{ notAge: number }> = success([
  [exampleId, { notAge: 34 }], // Shouldn't be able to add this to User type
])
const emailsSuccess: Response<{ email: string }> = success([
  [exampleId, { email: "pete@pete.com" }],
])

const badResult: RemoteData<{}, Map<UniqueId, User>> = pipe(
  sequenceS(remoteData)({
    namePairs: namesSuccess,
    agePairs: agesSuccess,
    emailPairs: emailsSuccess,
  }),
  map(({ namePairs, agePairs, emailPairs }) => [
    ...namePairs,
    ...agePairs,
    ...emailPairs,
  ]),
  map(M.fromFoldable(eqUniqueId, getObjectSemigroup<User>(), array))
) //?

fold(
  () => {},
  () => {},
  console.error,
  m => console.log(m)
)(badResult)

// getOrElse(() => (({} as unknown) as any))(desiredResult) //?

// // pipe(x, y => fn1(y, a => _), fn2)

// // x |> fn1 |> fn2

// const sequenceOptions = array.sequence(option)
// sequenceOptions([some(3), some(5), some(4)]) //?
// sequenceOptions([some(3), some(5), some(2)]) //?
// sequenceOptions([some(3), some(5), none]) //?

// const compactOptions = array.compact
// compactOptions([some(3), some(5), none]) //?

// const sequenceEithers = array.sequence(either)
// sequenceEithers([right(3), right(5), right(4)]) //?
// // sequenceEithers([left(3), left(5), right(5)]) //?
