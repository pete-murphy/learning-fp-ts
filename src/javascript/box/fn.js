const id = x => x
const fmap = x => f => g => g(f(x))

const Box = x => fmap(x)(id)

//            a  a -> m b
const chain = x => f => g => {
  g
  f
  x
  f(x)(id) //?
  return g(f(x)(id))
}
// extend :: w a -> (w a -> b) -> w b
const extend = x => f => g => {
  x
  f
  return g(wa => fmap(f))
}

const fold = x => f => f(x)

const app = x => f => g => {
  x(id)(id) //?
  f(id)//?
  g(fold)(id)(id) //?
  g(fold)(id)(id)(id)(id) //?
  g(fold)(id)(id)(id)(id)(id) //?
  return g(f(fmap)(x)(id))
}

Box(x => y => x + y)(
  // { 10 + 24 }
  app
)(Box(10))(
  // { 10 }
  app
)(Box(14)) // { 24 }

Box(5)(
  // { 5 }
  fmap
)(num => num + 5)(
  // { 10 }
  chain
)(num => {
  num
  return Box(num * 2)
})(
  // { 21 }
  chain
)(num => Box(num * 3)(fmap)(num => num + 1))(
  // { 64 }
  fold
)(id) //?

Box(5)(
  // { 5 }
  extend
)(num => num(fold)(id) + 5)(
  // { 10 }
  chain
)(num => {
  num
  return Box(num * 2)
})(
  // { 21 }
  chain
)(num => Box(num * 3)(fmap)(num => num + 1))(
  // { 64 }
  fold
)(id) //?

// extract :: w a -> a

// duplicate :: w a -> w (w a)

// Box(5)(id) //?

Box(5)(extend)(B => B(id))(id)(id) //?
