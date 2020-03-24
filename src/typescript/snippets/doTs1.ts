import { option, some, Option } from "fp-ts/lib/Option"
import { Do } from "fp-ts-contrib/lib/Do"
import { pipe } from "fp-ts/lib/pipeable"
import * as Record from "fp-ts/lib/Record"
import { sequenceS } from "fp-ts/lib/Apply"
import { identity } from "fp-ts/lib/Identity"

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

const nameById: Record<number, string> = {
  1: "Alice",
  2: "Bob",
  3: "Carol",
}

const cityById: Record<number, string> = {
  1: "Boston",
  2: "Chicago",
  3: "Miami",
}

const personFromId = (id: number): Option<Person> =>
  Do(option)
    .bind("name", Record.lookup(id, nameById))
    .bind("city", Record.lookup(id, cityById))
    .return(({ name, city }) => ({ id, name, city }))
// pipe(Record.lookup(id, nameById), nameOption =>
//   option.chain(nameOption, name =>
//     pipe(Record.lookup(id, cityById), cityOption =>
//       option.map(cityOption, city => ({
//         id,
//         name,
//         city,
//       }))
//     )
//   )
// )
// sequenceS(option)({
//   id: some(id),
//   name: Record.lookup(id, nameById),
//   city: Record.lookup(id, cityById),
// })

personFromId(3) //?
