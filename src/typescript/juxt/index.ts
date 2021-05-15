type Unary = (arg: any) => any
type UnaryROA = ReadonlyArray<Unary>
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
// The intersection of all the args of all the functions in the ReadonlyArray of Unary functions.
type JuxtArg<Fs extends UnaryROA> = UnionToIntersection<
  Parameters<Fs[number]>[0]
>
// An array of the union of all the return types  of all the functions in the ReadonlyArray.
type JuxtResult<Fs extends UnaryROA> = ReturnType<Fs[number]>[]
/**
 * Take an array of Unary functions, and apply them all to a single input argument.
 * Returns an array of the results.  Order will be maintained, but the type will be an
 * array of the union,
 *
 * type NamedEntity = { name: string }
 * type AgedEntity = { age: number }
 *
 * type Person = { name: string, age: number };
 * const me: Person = { name: 'Marc', age: 33 };
 *
 * const upperName = (ent: NamedEntity) => ent.name.toUpperCase();
 * const dblAge = (ent: AgedEntity) => ent.age * 2;
 *
 * const result = juxt([upperName, dblAge])(me);
 * // result === ['MARC', 66];
 * // typeof result = (string|number)[]
 */
const juxt: <Fs extends Unary[]>(
  fs: Fs
) => (input: JuxtArg<Fs>) => JuxtResult<Fs> = fs => input =>
  fs.map(f => f(input))
