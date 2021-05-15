// GCanti's version

type UnionToIntersection_<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

const juxt_ = <Fns extends ReadonlyArray<(a: any) => any>>(...fns: Fns) => (
  as: UnionToIntersection<Parameters<Fns[number]>[0]>
): { [i in keyof Fns]: Fns[i] extends (a: any) => infer B ? B : never } =>
  fns.map(f => f(as)) as any

// const result: [string, number]
const result = juxt_(upperName, dblAge)(me)
