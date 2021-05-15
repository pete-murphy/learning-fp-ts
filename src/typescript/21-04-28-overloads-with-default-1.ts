// function withDefault<T, U, T_ extends T | undefined, U_ extends U | undefined>(
//   t: T,
//   defaultOption: U
// ): NonNullable<T> extends T
//   ? T
//   : U extends
//   ? NonNullable<U>
//   : undefined {
//   if (t !== undefined) {
//     t
//     return t
//   }
//   if (defaultOption !== undefined) {
//     return defaultOption
//   }
//   return undefined
// }

// const x = withDefault(undefined, undefined)
// const y = withDefault(undefined, 2)
// const z = withDefault(2, "foo")

// function withDefault<T, U>(
//   t: T | undefined,
//   defaultOption: U | undefined
// ): T extends undefined
//   ? U extends undefined
//     ? undefined
//     : Exclude<U, undefined>
//   : Exclude<T | U, undefined> {

type NonUndefined<T> = T extends undefined ? never : T
function withDefault<T>(t: NonUndefined<T>, defaultOption: any): T
function withDefault<U>(t: undefined, defaultOption: U): U
function withDefault(t: undefined, defaultOption: undefined): undefined {
  if (t !== undefined) {
    return t
  }
  if (defaultOption !== undefined) {
    return defaultOption
  }
  return undefined
}

const w = withDefault(undefined, "foo")
const x = withDefault(undefined, undefined)
const y = withDefault(undefined, 2)
const z = withDefault(2, "foo")

// function foo123<T>(t: T): T extends undefined ? undefined : T {
//   if (t !== undefined) {
//     t
//     return t
//   }
//   return undefined
// }

// // const x = foo(undefined, undefined)
// // const y = foo(undefined, 2)
// // const z = foo(2, "foo")
