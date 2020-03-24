import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as Record from "fp-ts/lib/Record"
import { flip } from "fp-ts/lib/function"

// apPerson :: Int -> Maybe Person
// apPerson id =
//   { id, name: _, city: _ }
//     <$> Map.lookup id nameById
//     <*> Map.lookup id cityById

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

const personFromId = (id: number): O.Option<Person> =>
  pipe(
    (name: string) => (city: string) => ({ id, name, city }),
    f => O.map(f)(Record.lookup(id, nameById)),
    O.ap(Record.lookup(id, cityById))
  )

personFromId(3) //?
