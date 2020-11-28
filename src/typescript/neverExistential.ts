const apply = <F extends (x: never) => number>(f: F): F => f

const foo = () => 9
const bar = (x: number) => x + 9
const baz = (str: string) => str.length

apply(foo)()

apply(bar)(9)

apply(baz)("asdf")




// const fasdf = (searchValue: string) => 
// { 
// const regExpChar = /[\\^$.*+?()[\]{}|]/g // from lodash escapeRegExp function
// const searchValueRegex = new RegExp(
//   `^${searchValue.replace(regExpChar, '\\$&')}$`,
//   'ig',
// )

//  }

/**
 * Type guard for the `Function` type
 */
export const isFunction_ = (x: unknown): x is (params: unknown) => void =>
  x instanceof Function


/**
 * Type guard for the `Function` type
 */
export const isFunction = (x: unknown): x is (params: unknown) => void =>
  x instanceof Function

type FnOrNumber = number | ((x: string) => boolean)





const example = (x:FnOrNumber) => isFunction(x) ? x("") : x