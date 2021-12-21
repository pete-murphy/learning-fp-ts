// type ThunkedObject_<T, X> = {
//   readonly run: () => T[K]
//   readonly label: [K in keyof T] }

import { pipe, RA } from "./ssstuff/fp-ts-imports"

// const structMap: <I, O extends { [K in keyof I]: unknown }>(
//   f: <K extends keyof I>(ii: I[K]) => O[K]
// ) => (i: I) => O

// type Object<F>
const structMap =
  <I, O extends { [K in keyof I]: unknown }>(
    f: <K extends keyof I>(ii: I[K]) => O[K]
  ) =>
  (i: I): O => {
    const o = {} as O
    for (const k in i) {
      o[k] = f(i[k])
    }
    return o
  }
