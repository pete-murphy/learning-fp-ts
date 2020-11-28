import * as R from "ramda"

const { compose, over, lensProp, map, prop, partition, propEq } = R

// const partitionSettled = compose(
//   over(lensProp(1), map(prop('reason'))),
//   over(lensProp(0), map(prop('value'))),
//   partition(propEq('status', 'resolved')),
//   Promise.allSettled // await this
// );

const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const r1 = Promise.reject("some reason") //?
Promise.allSettled([r1, p1, p2]) //?
