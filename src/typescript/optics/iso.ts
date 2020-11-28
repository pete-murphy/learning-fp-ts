import { Iso } from "monocle-ts"
interface A {
  a: string
}
interface B {
  a: string
}
const aToB = (x: A) => x
const bToA = (x: B) => x

const abIso = new Iso<A, B>(aToB, bToA)

// const fooIso = new Iso<B, { foo: B }>(
//   foo => ({ foo }),
//   ({ foo }) => foo
// )
const getFooIso = <T>() =>
  new Iso<{ foo: T }, T>(
    ({ foo }) => foo,
    foo => ({ foo })
  )

const fooAfooBIso = getFooIso<A>()
  .composeIso(abIso)
  .composeIso(getFooIso<B>().reverse())
