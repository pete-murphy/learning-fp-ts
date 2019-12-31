type Traversal1<S, T, A, B> = (f: (a: A) => B) => (s: S) => T

const mkTraverse2 = <A, B>(): Traversal1<Array<A>, Array<B>, A, B> => f => xs =>
  xs.map(f)

const traverse2NumberString = mkTraverse2<number, string>()

traverse2NumberString(String)([1, 2, 3]) //?

// interface Traversal<S, T, A, B> {
//   (f: (a: A) => B): (s: S) => T
// }
