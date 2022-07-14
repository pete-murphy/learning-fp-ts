import {
  date,
  option,
  function as f,
  monoid,
  semigroup,
  readonlyArray,
  readonlyRecord
} from "fp-ts"
import * as dateFns from "date-fns/fp"
import * as fc from "fast-check"

type Item = {
  timestamp: Date
  type: "foo" | "bar"
  name: string
}

// Way of generating Items
const arbitraryItem: fc.Arbitrary<Item> = fc.record({
  timestamp: fc
    .date({
      min: new Date(2022, 6, 13),
      max: new Date(2022, 10, 13)
    })
    .noBias(),
  type: fc.constantFrom("bar", "foo"),
  name: fc.lorem()
})

const items: ReadonlyArray<Item> = fc.sample(
  arbitraryItem,
  200
)

const monoidNamesByYearByMonthByDay =
  readonlyRecord.getMonoid(
    readonlyRecord.getMonoid(
      readonlyRecord.getMonoid(
        readonlyArray.getMonoid<string>()
      )
    )
  )
// const M = monoid.struct({
//   foo: monoidNamesByYearByMonthByDay,
//   bar: monoidNamesByYearByMonthByDay
// })
// const M = readonlyRecord.getMonoid(
//   readonlyRecord.getMonoid(
//     readonlyRecord.getMonoid(
//       monoid.struct({
//         foo: readonlyArray.getMonoid<string>(),
//         bar: readonlyArray.getMonoid<string>(),
//       })
//     )
//   )
// )

const M = readonlyRecord.getMonoid(
  readonlyRecord.getMonoid(
    readonlyRecord.getMonoid(
      readonlyRecord.getMonoid(
        readonlyArray.getMonoid<string>()
      )
    )
  )
)

f.pipe(
  items,
  readonlyArray.foldMap(M)(item => {
    const [month, date, year] = new Intl.DateTimeFormat(
      "en-US",
      { dateStyle: "long" }
    )
      .format(item.timestamp)
      .split(/,? /)

    return {
      [item.type]: {
        [year]: {
          [month]: {
            [date]: [item.name]
          }
        }
      }
    }
  })
) //?
