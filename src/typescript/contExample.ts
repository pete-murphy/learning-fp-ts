interface Cont<A, R> {
  (f: (a: A) => R): R
}

const cont = {
  map: <A, B>(f: (a: A) => B) => <R>(c: Cont<A, R>): Cont<B, R> => {
    return br => _
  },
}
