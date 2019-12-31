import { ordString, max, contramap } from "fp-ts/lib/Ord"

type Item = {
  createdAt: string
}

const maxByCreatedAt = (x: Item, y: Item) =>
  ordString.compare(x.createdAt, y.createdAt) === 1 ? x : y

const itemA = {
  createdAt: "2019-10-22",
}
const itemB = {
  createdAt: "2019-01-22",
}

maxByCreatedAt(itemA, itemB) //?
max(contramap((x: Item) => x.createdAt)(ordString))(itemA, itemB) //?
