// import { HKT, Kind } from "fp-ts/lib/HKT"

// export type Tagged<Tag extends string, A> = {
//   readonly _tag: Tag
//   readonly contents: A
// }

// type Tree = Tagged<"Leaf", number> | Tagged<"Branch", [Tree, Tree]>

// // type Arithmetic = Tagged<"Lit", number> | Tagged<"Add", [Math, Math]>
// type Arithmetic = AST<Operator, number>
// type Operator<A> = Tagged<"Add", A>

// type AST<F, A> = Tagged<"Leaf", A> | Tagged<"Branch", HKT<F, AST<F, A>>>

import { pipe } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"

const ALL_VALUES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
] as const
type ValueTuple = typeof ALL_VALUES
type Value = ValueTuple[number]

const value_symbols: { [K in Value]: string } = {
  1: "One",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Jack",
  12: "Queen",
  13: "King",
}

enum Suit {
  Clubs = "Clubs",
  Diamonds = "Diamonds",
  Hearts = "Hearts",
  Spades = "Spades",
}

interface Card {
  value: Value
  suit: Suit
}

function printCard(card: Card): string {
  return `${value_symbols[card.value]} of ${card.suit}\n`
}

const suits = ["Clubs", "Diamonds", "Hearts", "Spades"]
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const cards = pipe(
  RA.Do,
  RA.apS("suit", suits),
  RA.apS("value", values)
)

console.log(cards)
//->
// [
//   { suit: 'Clubs', value: 1 },
//   { suit: 'Clubs', value: 2 },
//   { suit: 'Clubs', value: 3 },
//   { suit: 'Clubs', value: 4 },
//   { suit: 'Clubs', value: 5 },
//   { suit: 'Clubs', value: 6 },
//   { suit: 'Clubs', value: 7 },
//   { suit: 'Clubs', value: 8 },
//   { suit: 'Clubs', value: 9 },
//   { suit: 'Clubs', value: 10 },
//   { suit: 'Clubs', value: 11 },
//   { suit: 'Clubs', value: 12 },
//   { suit: 'Clubs', value: 13 },
//   { suit: 'Diamonds', value: 1 },
//   { suit: 'Diamonds', value: 2 },
//   { suit: 'Diamonds', value: 3 },
//   { suit: 'Diamonds', value: 4 },
//   { suit: 'Diamonds', value: 5 },
//   { suit: 'Diamonds', value: 6 },
//   { suit: 'Diamonds', value: 7 },
//   { suit: 'Diamonds', value: 8 },
//   { suit: 'Diamonds', value: 9 },
//   { suit: 'Diamonds', value: 10 },
//   { suit: 'Diamonds', value: 11 },
//   { suit: 'Diamonds', value: 12 },
//   { suit: 'Diamonds', value: 13 },
//   { suit: 'Hearts', value: 1 },
//   { suit: 'Hearts', value: 2 },
//   { suit: 'Hearts', value: 3 },
//   { suit: 'Hearts', value: 4 },
//   { suit: 'Hearts', value: 5 },
//   { suit: 'Hearts', value: 6 },
//   { suit: 'Hearts', value: 7 },
//   { suit: 'Hearts', value: 8 },
//   { suit: 'Hearts', value: 9 },
//   { suit: 'Hearts', value: 10 },
//   { suit: 'Hearts', value: 11 },
//   { suit: 'Hearts', value: 12 },
//   { suit: 'Hearts', value: 13 },
//   { suit: 'Spades', value: 1 },
//   { suit: 'Spades', value: 2 },
//   { suit: 'Spades', value: 3 },
//   { suit: 'Spades', value: 4 },
//   { suit: 'Spades', value: 5 },
//   { suit: 'Spades', value: 6 },
//   { suit: 'Spades', value: 7 },
//   { suit: 'Spades', value: 8 },
//   { suit: 'Spades', value: 9 },
//   { suit: 'Spades', value: 10 },
//   { suit: 'Spades', value: 11 },
//   { suit: 'Spades', value: 12 },
//   { suit: 'Spades', value: 13 }
// ]

// type Deck = Card[]
// const mkDeck = (): Deck => {
//     const  deck = [] as Card[]
//     for (const s of ){
//         for (const v of ALL_VALUES){
//             deck.push({
//                 value: v,
//                 suit: s
//             })
//         }
//     }
//     return deck
// }

// const deck = mkDeck()

// deck.map(c => console.log(printCard(c)))


const addItems = (items: Array<T>) =>
    items.reduce(
      (acc, cur) => R.insertAt(selectProps.getId(cur), cur)(acc),
      selectProps.selected,
    )