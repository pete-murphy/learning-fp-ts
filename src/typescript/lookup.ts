import { lookup } from "fp-ts/lib/Record"

export const getProp = (prop: string) => <V>(obj: Record<string, V>) => {
  return lookup(prop, obj)
}
