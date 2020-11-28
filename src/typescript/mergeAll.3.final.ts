import { contramap, fromCompare, Ord, ordNumber } from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

async function merge<T extends Promise<any>[]>(
  ...promises: T
): Promise<
  T[number] extends Promise<infer V> ? UnionToIntersection<V> : never
> {
  const pieces = await Promise.all(promises)
  return Object.assign({}, ...pieces)
}
