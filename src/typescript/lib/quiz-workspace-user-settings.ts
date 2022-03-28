import { Monoid, struct } from "fp-ts/Monoid"
import { getMonoid, getOrd, alt, none, Option, some } from "fp-ts/Option"
import { last, min, max, Semigroup } from "fp-ts/Semigroup"
import * as N from "fp-ts/number"
import * as Ord from "fp-ts/Ord"
import { flow } from "fp-ts/lib/function"

/** VSCode settings */
interface Settings {
  /** Controls the font family */
  readonly fontFamily: Option<string>
  /** Controls the font size in pixels */
  readonly fontSize: Option<number>
  /** Limit the width of the minimap to render at most a certain number of columns. */
  readonly maxColumn: Option<number>
}
// /**
//  * @category Invariant
//  */
// export const imap: <A, B>(
//   f: (b: B) => A,
//   g: (a: A) => B
// ) => (fa: Semigroup<A>) => Semigroup<B> = (f, g) => fa => ({
//   concat: (first, second) => g(fa.concat(f(first), f(second))),
// })

const lastMax = (max: number): Monoid<Option<number>> => ({
  concat: flow(
    Ord.max(getOrd(N.Ord)),
    Ord.clamp(getOrd(N.Ord))(none, some(max)),
    alt(() => some(max))
  ),
  empty: some(max),
})

Math.min(80, Math.max(920, 209)) //?

// const lastMaxMN = (max: number): Monoid<Option<number>> => ({
//   concat: (x, y) =>
// })

const monoidSettings: Monoid<Settings> = struct({
  fontFamily: getMonoid(last()),
  fontSize: getMonoid(last()),
  maxColumn: lastMax(80),
})

// const workspaceSettings: Settings = {
//   fontFamily: some("Courier"),
//   fontSize: none,
//   maxColumn: some(80),
// }

const workspaceSettings: Settings = {
  fontFamily: some("Courier"),
  fontSize: none,
  maxColumn: some(90),
}

const userSettings: Settings = {
  fontFamily: some("Fira Code"),
  fontSize: some(12),
  maxColumn: none,
}

/** userSettings overrides workspaceSettings */
console.log(monoidSettings.concat(workspaceSettings, userSettings))
/*
{ fontFamily: some("Fira Code"),
  fontSize: some(12),
  maxColumn: some(80) }
*/

// ----------------------
// Quiz. Suppose VSCode cannot manage more than 80 columns per row, how could we modify the definition of monoidSettings to take that into account?
// ----------------------
