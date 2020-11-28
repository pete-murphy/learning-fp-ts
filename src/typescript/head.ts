// let take: (n: number) => <A>(xs: Array<A>) => Array<A>
// take = n => xs => xs.slice(0, n)

// let prop: <A extends Record<string, unknown>, K extends keyof A>(
//   k: K
// ) => (obj: A) => A[K]
// prop = k => obj => obj[k]

type Foo_<A> = {
  foo: A
}

let example = <A>(properties: { [K in keyof A]: Foo_<A[K]> }): A =>
  
