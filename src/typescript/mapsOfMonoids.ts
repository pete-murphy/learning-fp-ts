import * as M from "fp-ts/lib/Map"
import {
  RemoteData,
  success,
  pending,
  remoteData,
} from "@devexperts/remote-data-ts"
import { Monoid, getStructMonoid, monoidString } from "fp-ts/lib/Monoid"
import { array } from "fp-ts/lib/Array"
import { Option, some } from "fp-ts/lib/Option"

type User = {
  name: string
  age: Option<number>
  email: Option<string>
}

const namesSuccess: RemoteData<
  {},
  Array<[number, Pick<User, "name">]>
> = success([[0, { name: "Pete" }]])

const agesPending: RemoteData<{}, Array<[number, Pick<User, "age">]>> = pending

const emailsPending: RemoteData<
  {},
  Array<[number, Pick<User, "email">]>
> = success([[0, { email: some("pete@pete.com") }]]) // Suppose I had a lens that did this
