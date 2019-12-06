import { Lens, fromTraversable } from "monocle-ts"
import { array } from "fp-ts/lib/Array"
import { identity } from "fp-ts/lib/function"

type User = {
  id: number
  name: string
}

const traversal = fromTraversable(array)<User>()
const mkUserLens = Lens.fromProp<User>()
const userToNameLens = mkUserLens("name")
const userToIdLens = mkUserLens("id")
const toLocaleUpperCase = (str: string) => str.toLocaleUpperCase()

const simpleUsers: Array<User> = [
  { id: 0, name: "Pete" },
  { id: 1, name: "Carol" },
  { id: 2, name: "Toni" },
]

traversal.modify(u =>
  u.id > 0 ? userToNameLens.modify(toLocaleUpperCase)(u) : u
)(simpleUsers) //?

traversal.modify(u =>
  (u.id > 0 ? userToNameLens.modify(toLocaleUpperCase) : identity)(u)
)(simpleUsers) //?
