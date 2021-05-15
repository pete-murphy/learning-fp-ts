import { RM, Ord } from "../fp-ts-imports"
import * as I from "./Interval"
import * as Ex from "./Extended"

type IntervalSet<A> = ReadonlyMap<Ex.Extended<A>, I.Interval<A>>

export const singleton =
  // <A>(ordA: Ord.Ord<A>) =>
  <A>(interval: I.Interval<A>): IntervalSet<A> =>
    I.isEmpty(interval)
      ? RM.empty
      : RM.singleton(I.lowerBound(interval), interval)

export const infinite = singleton(I.infinite)

export const empty = RM.empty

// whole :: Ord r => IntervalSet r
// whole = singleton $ Interval.whole

// -- | empty interval set
// empty :: Ord r => IntervalSet r
// empty = IntervalSet Map.empty

// -- | single interval
// singleton :: Ord r => Interval r -> IntervalSet r
// singleton i
//   | Interval.null i = empty
//   | otherwise = IntervalSet $ Map.singleton (Interval.lowerBound i) i
