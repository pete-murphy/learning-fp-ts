import { Eq } from "fp-ts/lib/Eq"

const eqByStringId = {
  equals: <A extends { id: string }>(x: A, y: A) => x.id === y.id,
}

type User = {
  id: string
  name: string
}
type OtherThing = {
  id: string
  country: string
}

const user1: User = {
  id: "1",
  name: "Alice",
}

const user2: OtherThing = {
  id: "1",
  country: "Bob",
}

eqByStringId.equals(user1, user2) //?
