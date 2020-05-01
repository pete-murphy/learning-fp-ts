/* BROKEN */
const transposeRecord = <A>(
  r: Record<string, Array<A>>
): Array<Record<string, A>> =>
  Object.entries(r).reduce(
    (acc: Array<Record<string, A>>, [k, vs], i) => ((acc[i][k] = vs[i]), acc),
    Array(r[Object.keys(r)[0]].length).fill({})
  )

transposeRecord({
  a: [1, 2, 3],
}) //?
