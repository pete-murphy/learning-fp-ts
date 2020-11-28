// https://egghead.io/lessons/javascript-list-comprehensions-with-applicative-functors
const { List } = require("immutable-ext")
console.clear()

const merch = () =>
  List.of(x => y => `${x} ${y}`)
    .ap(List.of("teeshirt", "sweater"))
    .ap(List.of("S", "M", "L"))

// console.log(merch())
// 1. The output currently for merch()
// List {
//   size: 2,
//   _origin: 0,
//   _capacity: 2,
//   _level: 5,
//   _root: null,
//   _tail: VNode { array: [ [Function], [Function] ], ownerID: OwnerID {} },
//   __ownerID: undefined,
//   __hash: undefined,
//   __altered: true
// }

// console.log(merch().inspect())
// 2. The output for merch().inspect()
// List [ y => z => `${x} ${y} ${z}`, y => z => `${x} ${y} ${z}` ]

// 3. What it should be (ignore formatting):
// console.log(merch())
// teeshirt S
// teeshirt M
// teeshirt L
// sweater S
// sweater M
// sweater L

const isDivisibleBy3 = x => x % 3 == 0

const not = predicate => x => !predicate(x)

const xs = [1, 2, 3, 4, 5, 6].filter(not(isDivisibleBy3)) //?
