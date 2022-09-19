// https://terbium.io/2020/09/debt-simplification/

import {
  N,
  RA,
  RR,
  Str,
  pipe,
  O,
  RNEA,
  T,
  flow,
  Sg
} from "./lib/fp-ts-imports"

import * as d3 from "d3"
import fs from "fs/promises"

// people = ["Grace", "Ivan", "Judy", "Luke", "Mallory"]
// debts = [
//     ("Grace", "Ivan", 5),
//     ("Grace", "Judy", 3),
//     ("Ivan", "Grace", 2),
//     ("Ivan", "Mallory", 5),
//     ("Judy", "Grace", 10),
//     ("Judy", "Luke", 4),
//     ("Judy", "Mallory", 6),
//     ("Judy", "Mallory", 2),
//     ("Luke", "Ivan", 4),
//     ("Mallory", "Grace", 15),
//     ("Mallory", "Luke", 6),
//     ("Mallory", "Judy", 11),
// ]

const exampleDebts: ReadonlyArray<Debt> = [
  { from: "Grace", to: "Ivan", amount: 5 },
  { from: "Grace", to: "Judy", amount: 3 },
  { from: "Ivan", to: "Grace", amount: 2 },
  { from: "Ivan", to: "Mallory", amount: 5 },
  { from: "Judy", to: "Grace", amount: 10 },
  { from: "Judy", to: "Luke", amount: 4 },
  { from: "Judy", to: "Mallory", amount: 6 },
  { from: "Judy", to: "Mallory", amount: 2 },
  { from: "Luke", to: "Ivan", amount: 4 },
  { from: "Mallory", to: "Grace", amount: 15 },
  { from: "Mallory", to: "Luke", amount: 6 },
  { from: "Mallory", to: "Judy", amount: 11 }
]

type Debt = {
  readonly from: string
  readonly to: string
  readonly amount: number
}

// def compute_balances(debts):
//     balances = {person: 0 for person in people}
//     for (debtor, creditor, value) in debts:
//         balances[debtor] -= value
//         balances[creditor] += value
//     return balances
// compute_balances(debts)

type Balances = RR.ReadonlyRecord<string, number>

function computeBalances(
  debts: ReadonlyArray<Debt>
): Balances {
  const M = RR.getMonoid(N.SemigroupSum)
  return pipe(
    debts,
    RA.foldMap(M)(({ from, to, amount }) => ({
      [from]: -amount,
      [to]: amount
    }))
  )
}

computeBalances(exampleDebts) //?

// def simplify_with_collector(balances):
//     collector = next(iter(balances.keys()))
//     return [(collector, person, balance) for (person, balance)
//             in balances.items() if person != collector]

// def show_transactions(transactions):
//     for (debtor, creditor, value) in transactions:
//         if value > 0:
//             print(f"{debtor} owes {creditor} ${value}")
//         else:
//             print(f"{creditor} owes {debtor} ${-value}")

// collector_transactions = simplify_with_collector(compute_balances(debts))
// show_transactions(collector_transactions)

function simplifyWithCollector(
  balances: Balances,
  collector?: string
): ReadonlyArray<Debt> {
  return pipe(
    O.Do,
    O.apS(
      "collector",
      pipe(
        O.fromNullable(collector),
        O.alt(() => RA.head(RR.keys(balances)))
      )
    ),
    O.map(({ collector }) =>
      pipe(
        balances,
        RR.foldMapWithIndex(Str.Ord)(
          RA.getMonoid<Debt>()
        )((key, amount) =>
          key === collector
            ? []
            : [
                amount > 0
                  ? {
                      to: collector,
                      from: key,
                      amount
                    }
                  : {
                      to: key,
                      from: collector,
                      amount: Math.abs(amount)
                    }
              ]
        )
      )
    ),
    O.getOrElseW(() => [])
  )
}

simplifyWithCollector(
  computeBalances(exampleDebts)
) //?

// Subset sum problem
//
// combinations :: Int -> [a] -> [[a]]
// combinations 0 _      = [[]]
// combinations _ []     = []
// combinations k (x:xs) = map (x:) (combinations (k - 1) xs) ++
//                           combinations k xs

function combinations<A>(
  k: number,
  xs: ReadonlyArray<A>
): ReadonlyArray<ReadonlyArray<A>> {
  if (k === 0) return [[]]
  if (xs.length === 0) return []
  const [x, ...xs_] = xs
  return pipe(
    combinations(k - 1, xs_),
    RA.map(RA.prepend(x)),
    RA.concat(combinations(k, xs_))
  )
}

// import itertools

// def find_zero_subset(balances):
//     for i in range(1, len(balances)):
//         for subset in itertools.combinations(balances.items(), i):
//             if sum([balance[1] for balance in subset]) == 0:
//                 return [balance[0] for balance in subset]
//     return None

// remaining_set = compute_balances(debts)
// subsets = []
// while (subset := find_zero_subset(remaining_set)) is not None:
//     subsets.append(subset)
//     remaining_set = {x[0]: x[1] for x in remaining_set.items() if x[0] not in subset}
// subsets.append(list(remaining_set.keys()))
// subsets

function findZeroSubset(balances: Balances) {
  return pipe(
    RNEA.range(1, RR.keys(balances).length),
    RA.reverse,
    RA.chain(i =>
      combinations(
        i,
        RR.toReadonlyArray(balances)
      )
    ),
    RA.filter(xs => {
      const sum = pipe(
        xs,
        RA.foldMap(N.MonoidSum)(([x, n]) => n)
      )
      return sum < 0.1 && sum > -0.1
    })
  )
}

findZeroSubset(computeBalances(exampleDebts)) //?
// findZeroSubset(computeBalances(exampleDebts)).map(
//   xs =>
//     xs.map(ns =>
//       ns.reduce((n, [key, x]) => n + x, 0)
//     )
// ) //?
