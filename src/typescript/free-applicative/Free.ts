import * as TEq from "./TypeEquals"

// -- | The free 'Applicative' for a 'Functor' @f@.
// data Ap f a where
//   Pure :: a -> Ap f a
//   Ap   :: f a -> Ap f (a -> b) -> Ap f b
//
// ...which may be the same as...???
// data Ap f a
//   = x ~ a -> Pure a
//   | x ~ b -> Ap (f a) (Ap f (a -> b))
// export type Free<F, A> =
// | {
//   readonly tag: 'Pure'
//   readonly proof: TEq.TypeEquals<, A>
// }
// | {
//   readonly tag: 'Pure'
//   readonly left: Expr<number>
//   readonly right: Expr<number>
//   readonly proof: Leibniz<number, A>
// }

// I gave up on this one :\
