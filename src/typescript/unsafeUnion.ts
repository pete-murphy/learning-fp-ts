export const unsafeUnionFn = (
  r1: { [key: string]: unknown },
  r2: { [key: string]: unknown }
) => {
  let copy: { [key: string]: unknown } = {}
  for (const k1 in r2) {
    if ({}.hasOwnProperty.call(r2, k1)) {
      copy[k1] = r2[k1]
    }
  }
  for (const k2 in r1) {
    if ({}.hasOwnProperty.call(r1, k2)) {
      copy[k2] = r1[k2]
    }
  }
  return copy
}
