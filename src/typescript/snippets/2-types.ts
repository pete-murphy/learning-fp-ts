import { option, some, Option } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as Record from "fp-ts/lib/Record"
import { sequenceS } from "fp-ts/lib/Apply"
import { Do } from "fp-ts-contrib/lib/Do"

// apPerson :: Int -> Maybe Person
// apPerson id =
//   { id, name: _, city: _ }
//     <$> Map.lookup id nameById
//     <*> Map.lookup id cityById
type PersonKey = string

type Person = {
  id: number
  name: string
  city: string
}

enum City {
  BOS = "BOS",
  CHI = "CHI",
  MIA = "MIA",
}

const nameAndCityIdByNameId: Record<number, { name: string; cityId: City }> = {
  1: { name: "Alice", cityId: City.BOS },
  2: { name: "Bob", cityId: City.MIA },
  3: { name: "Carol", cityId: City.CHI },
  4: { name: "Dave", cityId: City.BOS },
}

const cityById: Record<City, string> = {
  [City.BOS]: "Boston",
  [City.CHI]: "Chicago",
  [City.MIA]: "Miami",
}

const c_personFromId = (id: number): Option<Person> =>
  pipe(Record.lookup(id, nameAndCityIdByNameId), nameAndCityOption =>
    option.chain(nameAndCityOption, ({ name, cityId }) =>
      pipe(Record.lookup(cityId, cityById), cityOption =>
        option.map(cityOption, city => ({
          id,
          name,
          city,
        }))
      )
    )
  )
c_personFromId(5) //?

const d_personFromId = (id: number): Option<Person> =>
  Do(option)
    .bind("nameAndCity", Record.lookup(id, nameAndCityIdByNameId))
    .bindL("city", ({ nameAndCity }) =>
      Record.lookup(nameAndCity.cityId, cityById)
    )
    .return(({ nameAndCity, city }) => ({ id, name: nameAndCity.name, city }))
d_personFromId(5) //?
d_personFromId(4) //?

// const personFromId = (id: number): Option<Person> =>
//   pipe(Record.lookup(id, nameById), nameOption =>
//     option.chain(nameOption, name =>
//       pipe(Record.lookup(id, cityById), cityOption =>
//         option.map(cityOption, city => ({
//           id,
//           name,
//           city,
//         }))
//       )
//     )
//   )
// // sequenceS(option)({
// //   id: some(id),
// //   name: Record.lookup(id, nameById),
// //   city: Record.lookup(id, cityById),
// // })
