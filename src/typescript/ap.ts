const liftA2Array = <A, B, C>(
  fn: (a: A) => (b: B) => C,
  as: Array<A>,
  bs: Array<B>
): Array<C> => {
  // Mapping `fn` over `as` yields an array of functions of type `(b: B) => C`
  const bcs: Array<(b: B) => C> = as.map(fn)

  let acc: Array<C> = []

  for (let i = 0; i < Math.min(bcs.length, bs.length); i++) {
    const bc = bcs[i]
    const b = bs[i]
    acc.push(bc(b))
  }

  return acc
}

const add = (x: number) => (y: number) => x + y

liftA2Array(add, [1, 2, 3], [100, 0, 900]) //?
