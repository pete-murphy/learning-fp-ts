type ZipArray<A> = Array<A>

const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (
  as: ZipArray<A>,
  bs: ZipArray<B>
): ZipArray<C> => {
  let acc = []
  while (as.length > 0 && bs.length > 0) {
    let a = as.shift()
    let b = bs.shift()
    acc.push(f(a!, b!))
  }
  return acc
}

const plus = (x: number, y: number) => x + y

lift2(plus)([1, 2, 3], [10, 20, 30])

const pure = <A>(a: A): ZipArray<A> => []
