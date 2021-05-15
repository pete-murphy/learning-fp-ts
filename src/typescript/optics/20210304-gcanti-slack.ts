import { increment, pipe } from "fp-ts/function"
import { eqString } from "fp-ts/lib/Eq"
import { Option } from "fp-ts/Option"
import { indexReadonlyMap } from "monocle-ts/Ix"
import * as L from "monocle-ts/Lens"
import * as O from "monocle-ts/Optional"

/*
In monocle-ts there's a type Optional. it contains a setter that can always put a value into a structure as well as a getter that returns an optional.
When it's used with the modifyOption function, the modification function is only run if the getter succeeded. If not, the unchanged structure is returned.
Sometimes this sort of "silent failure" is what you want, but sometimes not.
An alternative design is e.g. Map.modifyAt which returns an option in case of failure.
As far as I know this behavior in the lens is because of composability. What I'm trying to achieve is:
Here's what I try to archive:
type Company = {
  persons: Map<string, Person>;
  name: string;
};
type Person = { name: string; age: number };
by lens composition I like to get to for example a function incrmentAge of type (personKey: string, company: Company) => Option<Company>
Is there a straightforward composable way to do so?
*/

type Company = {
  readonly persons: ReadonlyMap<string, Person>
  readonly name: string
}

type Person = {
  readonly name: string
  readonly age: number
}

const persons = pipe(L.id<Company>(), L.prop("persons"))
const age = pipe(L.id<Person>(), L.prop("age"))
const indexPersons = indexReadonlyMap(eqString)<Person>()

export const incrementAge = (
  personKey: string
): ((company: Company) => Option<Company>) =>
  pipe(
    persons,
    L.composeOptional(indexPersons.index(personKey)),
    O.composeLens(age),
    O.modifyOption(increment)
  )

console.log(incrementAge("a")({ persons: new Map(), name: "name" })) // => none
console.log(
  incrementAge("a")({
    persons: new Map([["a", { name: "name", age: 18 }]]),
    name: "name",
  })
) // => some(...)
