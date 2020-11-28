import { makeBy, range as arrayRange } from "fp-ts/lib/ReadonlyArray"

const range = (start: number, end: number) =>
  Array(end - start + 1)
    .fill(null) // Need to fill it with something I think
    .map((_, i) => start + i)

range(1, 20) //?

const createOptions_ = (start: number, end: number) => {
  let options = []
  if (start % 2 === 0) {
    for (let i = start; i <= end; i += 2) {
      options.push({ value: i, label: i })
    }
  } else {
    for (let i = start; i <= end; i++) {
      options.push({ value: i, label: i })
    }
  }
  return options
}

const isEven = (n: number) => n % 2 === 0
// const createOptions = (start: number, end: number) =>
//   makeBy(end - start + 1, i => ({
//     value: i + start,
//     label: i + start,
//   })).filter((_, i) => (isEven(start) ? isEven(i) : true))

const createOptions = (start: number, end: number) =>
  range(start, end)
    .map(i => ({
      value: i,
      label: i,
    }))
    .filter((_, i) => (isEven(start) ? isEven(i) : true))

createOptions(1, 3) //?
createOptions_(1, 3) //?

createOptions(2, 3) //?
createOptions_(2, 3) //?
createOptions(22, 30) //?
createOptions_(22, 30) //?

createOptions(0, 3) //?
createOptions_(0, 3) //?
createOptions(0, 4) //?
createOptions_(0, 4) //?

// {
//   let options = []
//   if (start % 2 === 0) {
//     for (let i = start; i <= end; i += 2) {
//       options.push({ value: i, label: i })
//     }
//   } else {
//     for (let i = start; i <= end; i++) {
//       options.push({ value: i, label: i })
//     }
//   }
//   return options
// }
