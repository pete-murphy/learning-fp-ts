const arrayA = [9, 5, 4, 7]
const arrayB = [3, 2, 4, 5, 2, 1, 1, 3, 4]

function matchWithSum(targetSumArray, valueArray) {
  let returnValue = []
  let valueArray_ = [...valueArray]
  for (const targetSum of targetSumArray) {
    let acc = []
    let sum = 0
    while (sum < targetSum) {
      const value = valueArray_.shift()
      sum += value
      acc.push(value)
    }
    returnValue.push(acc)
  }
  return returnValue
}

console.log(matchWithSum(arrayA, arrayB))
// expected result:
// [ [ 3, 2, 4 ], [ 5 ], [ 2, 1, 1 ], [ 3, 4 ] ]
