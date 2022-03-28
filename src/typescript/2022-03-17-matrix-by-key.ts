// This might be too specific a task, but given a 2D array:
// [
//  [a,b,c]
//  [1,2,3]
//  [4,5,6]
// ]
// Is there a utility to key a map by elements in the first array i.e.
// a -> [1,4]
// b -> [2,5]
// c -> [3,6]

import {
  Eq,
  pipe,
  RA,
  RM,
  RTup,
  Str,
  tuple
} from "./lib/fp-ts-imports"

type Table<K, A> = [
  ReadonlyArray<K>,
  ...ReadonlyArray<ReadonlyArray<A>>
]

const tableToMap =
  <K>(eqK: Eq.Eq<K>) =>
  <A>([headers, ...rows]: Table<K, A>): ReadonlyMap<
    K,
    ReadonlyArray<A>
  > =>
    pipe(
      rows,
      RA.chain(row =>
        RA.zipWith(headers, row, (header, cell) =>
          tuple(header, [cell])
        )
      ),
      RM.fromFoldable(eqK, RA.getMonoid<A>(), RA.Foldable)
    )

const table: Table<string, number> = [
  ["a", "b", "c"],
  [1, 2, 3],
  [4, 5, 6]
]

pipe(table, tableToMap(Str.Eq))
//-> Map { 'a' => [ 1, 4 ], 'b' => [ 2, 5 ], 'c' => [ 3, 6 ] }
