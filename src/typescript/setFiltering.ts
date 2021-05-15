import { not, pipe } from "fp-ts/lib/function"
import * as Eq from "fp-ts/lib/Eq"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as O from "fp-ts/lib/Option"

type FeaturedPlan = {
  card: { package: string }
}

type ContentPlan = {
  key: string
}

const featuredPlans: ReadonlyArray<FeaturedPlan> = [
  { card: { package: "foo" } },
  { card: { package: "bar" } },
  { card: { package: "baz" } },
]
const selectedContentPlans: ReadonlyArray<ContentPlan> = [
  { key: "bar" },
  { key: "baz" },
  { key: "quux" },
  { key: "quuz" },
]

const ex1 = pipe(
  featuredPlans,
  RA.filter(({ card }) =>
    pipe(
      selectedContentPlans,
      RA.findFirst(({ key }) => key === card.package),
      O.isNone
    )
  )
)
ex1 //?

const ex2 = pipe(
  featuredPlans,
  RA.filter(({ card }) => 
    pipe(
      selectedContentPlans,
      RA.in
      RA.every(({ key }) => key !== card.package),
    )
  )
)
ex2