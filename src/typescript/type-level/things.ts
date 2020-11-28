type Example<R extends Record<string, unknown>> = {
  foo: Extract<keyof R, string>
}

const f = <A extends Record<string, unknown>>(ex: Example<A>) =>
  onlyTakesStrings(ex.foo)

const onlyTakesStrings = (str: string) => "ya"

type G = {
  g1: number
  g2: boolean
}

const g_ = f<G>({ foo: "g2" })
