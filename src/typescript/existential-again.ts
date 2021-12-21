// data Foo = forall a. MkFoo a (a -> Bool)
//          | Nil
// MkFoo :: forall a. a -> (a -> Bool) -> Foo
// Nil   :: Foo

export type Foo = MkFoo | null
type MkFoo_<A> = [A, (a: A) => boolean]
type MkFoo = <R>(run: <A>(_: MkFoo_<A>) => R) => R

const mkFoo =
  <A>(mkFoo_: MkFoo_<A>): MkFoo =>
  run =>
    run(mkFoo_)
