import posts from "./posts.json"
import users from "./users.json"
import * as RR from "fp-ts/ReadonlyRecord"
import { pipe, tuple } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import * as Sg from "fp-ts/Semigroup"
import * as N from "fp-ts/number"
import * as O from "fp-ts/Option"

type User = typeof users[number]

const namesOfUsersInNorthernHemisphere1 = users
  .filter(user => Number(user.address.geo.lat) > 0)
  .map(user => user.name)

const namesOfUsersInNorthernHemisphere2 = users.reduce<
  ReadonlyArray<string>
>(
  (acc, user) =>
    Number(user.address.geo.lat) > 0
      ? acc.concat(user.name)
      : acc,
  []
)

const namesOfUsersInNorthernHemisphere3 = users.flatMap<
  ReadonlyArray<string>
>(user =>
  Number(user.address.geo.lat) > 0 ? [user.name] : []
)

const namesOfUsersInNorthernHemisphere4 = pipe(
  users,
  RA.filterMap(user =>
    Number(user.address.geo.lat) > 0
      ? O.some(user.name)
      : O.none
  )
)

const namesOfUsersInNorthernHemisphere5 = pipe(
  users,
  RA.chain(user =>
    Number(user.address.geo.lat) > 0 ? [user.name] : []
  )
)

console.log({
  namesOfUsersInNorthernHemisphere1,
  namesOfUsersInNorthernHemisphere2,
  namesOfUsersInNorthernHemisphere3,
  namesOfUsersInNorthernHemisphere4,
  namesOfUsersInNorthernHemisphere5
})

// .filter(user => Number(user.address.geo.lat) > 0)
// .map(user => user.name)
