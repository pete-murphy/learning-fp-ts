const a = 9
const amb = x => Promise.resolve(x + 10)
const ma = Promise.resolve(10)
const f = x => x + 2

// Fair enough, I should walk back my statement a little bit further and say that Promises are lawful monads if you take away the overloading of `then` *and* restrict yourself to work with a subset of the API.
const point = x => Promise.resolve(x)

// Left identity
point(a).then(amb) === amb(a)

// Right identity
ma.then(point) === ma

// Associativity
ma.then(x => amb(x).then(f)) === ma.then(amb).then(f)

// // Left identity
// Promise.resolve(a).then(k) === k(a) //?

// // Right identity
// m.then(Promise.resolve) === m

// // Associativity
// m.then(x => k(x).then(h)) === m.then(k).then(h)

// m.then(x => Promise.resolve(x)) //?
