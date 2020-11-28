// export async function mergeAll<T>(
//   each: Promise<Partial<T>>[],
//   empty: { [key in keyof T]: null }
// ): Promise<null | T> {
//   const pieces = await Promise.all(each)
//   const result: T = Object.assign({}, empty, ...pieces)
//   return Object.values(result).includes(null) ? null : result
// }

// async function mergeAll<T>(
//   each: Promise<Partial<T>>[],
//   empty: { [key in keyof T]: null }
// ): Promise<null | T> {
//   const pieces = await Promise.all(each)
//   const result: T = Object.assign({}, ...pieces)
//   for (const k in empty) {
//     if (result[k] == null) return null
//   }
//   return result
// }

async function mergeAll<T>(
  each: Promise<Partial<T>>[],
  keys: [keyof T]
): Promise<null | T> {
  const pieces = await Promise.all(each)
  const result = Object.assign({}, ...pieces)
  for (const k in keys) {
    if (result[k] == null) return null
  }
  return result
}
