import { O, pipe, RR } from "./lib/fp-ts-imports";

interface Person {
  id: number;
  pet: O.Option<"dog" | "cat">;
}

const person: Person = { id: 1, pet: O.some("dog") };

// pipe(person,
// RR.traverse(O.Applicative)(

// )
//   )

// simplest case:
const maybePersonWithPet = pipe(
  person.pet,
  O.map(pet => ({ ...person, pet })),
);

// very often slightly more cumbersome:
const maybePersonWithPet2 = pipe(
  O.some(person),
  O.filterMap(p =>
    pipe(
      p.pet,
      O.map(pet => ({ ...p, pet })),
    ),
  ),
);

console.log(maybePersonWithPet);
console.log(maybePersonWithPet2);
// { _tag: 'Some', value: { id: 1, pet: 'dog' }
