import * as E from "fp-ts/lib/Either"
import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import { flow, constant } from "fp-ts/lib/function"

type Suit = "hearts" | "diamonds" | "spades" | "clubs"
// const isSuit = (suit: Suit | any): suit is Suit =>
//   // any way to actually use the type Suit here?
//   suit === 'hearts' || suit === 'diamonds' || suit === 'spades' || suit === 'clubs'

const isSuit = (suit: unknown): suit is Suit =>
  typeof suit === "string" && suit in Suit

const items: Array<E.Either<number, number>> = [
  E.right(1),
  E.left(0),
  E.right(2),
  E.right(3),
]

pipe(
  items,
  A.filterMap(
    E.bimap(
      () => true,
      (n) => n > 2
    )
  )
  // A.filter((x) => E.isRight(x) && x.right > 2)
)
