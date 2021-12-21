import * as RA from "fp-ts/lib/ReadonlyArray"
import * as E from "fp-ts/lib/Either"
import * as t from "io-ts"
import { formatValidationErrors } from "io-ts-reporters"
import { pipe } from "fp-ts/lib/function"
import { apS } from "fp-ts/lib/Apply"

const decodeGolfer = t.type({ name: t.string }).decode
const decodeClub = t.type({
  brand: t.union([t.literal("CoolBrand1"), t.literal("CoolBrand2")]),
}).decode

type GolferWithClub = {
  name: string
  club: {
    brand: "CoolBrand1" | "CoolBrand2"
  }
}
const arrayOfObjectsSchema = t.array(t.UnknownRecord)

export function decodeGolfersWithClubs({
  rawGolfers,
  rawClubs,
}: {
  rawGolfers: unknown
  rawClubs: unknown
}): E.Either<ReadonlyArray<t.ValidationError>, ReadonlyArray<GolferWithClub>> {
  const result = pipe(
    E.Do,
    E.apS("golfers", arrayOfObjectsSchema.decode(rawGolfers)),
    E.apS("clubs", arrayOfObjectsSchema.decode(rawClubs)),
    E.map(({ golfers, clubs }) => RA.zip(golfers, clubs)),
    E.chain(
      E.traverseArray(([golfer, club]) => {
        // An applicative instance for Either that collects Lefts
        // using the supplied semigroup instance
        const V = E.getApplicativeValidation(
          RA.getSemigroup<t.ValidationError>()
        )

        return pipe(
          E.Do,
          apS(V)("decodedGolfer", decodeGolfer(golfer)),
          apS(V)("decodedClub", decodeClub(club)),
          E.map(({ decodedGolfer, decodedClub }) => ({
            ...decodedGolfer,
            club: decodedClub,
          }))
        )
      })
    )
  )

  return result
}

const rawGolfers_GOOD = [{ name: "Alice" }, { name: "Bob" }, { name: "Carol" }]

const rawGolfers_BAD = [{ name: "Alice" }, { name: 0 }, { name: "Carol" }]

const rawClubs_GOOD = [
  { brand: "CoolBrand1" },
  { brand: "CoolBrand2" },
  { brand: "CoolBrand1" },
]

const rawClubs_BAD = [
  { brand: "CoolBrand1" },
  { brand: "BadBrand2" },
  { brand: "CoolBrand1" },
]

const bothGood = decodeGolfersWithClubs({
  rawGolfers: rawGolfers_GOOD,
  rawClubs: rawClubs_GOOD,
})

const oneBad = decodeGolfersWithClubs({
  rawGolfers: rawGolfers_BAD,
  rawClubs: rawClubs_GOOD,
})

const bothBad = decodeGolfersWithClubs({
  rawGolfers: rawGolfers_BAD,
  rawClubs: rawClubs_BAD,
})

const report = (errs: ReadonlyArray<t.ValidationError>) =>
  pipe(errs, RA.toArray, formatValidationErrors, strs =>
    "\n".concat(strs.join("\n"))
  )

console.log("bothGood:", E.fold(report, JSON.stringify)(bothGood))
console.log("oneBad:", E.fold(report, JSON.stringify)(oneBad))
console.log("bothBad:", E.fold(report, JSON.stringify)(bothBad))
