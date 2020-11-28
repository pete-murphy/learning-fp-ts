const empty: Array<never> = []

const xs: Array<number> = empty

type Right<A> = {
  readonly tag: "right"
  readonly value: A
}
type Left<B> = {
  readonly tag: "left"
  readonly value: B
}
type Either<B, A> = Left<B> | Right<A>
