function sum(arr, n) {
  var x
  if (n <= 0) {
    return 0
  } else {
    x = sum(arr, n - 1) + arr[n - 1]
    console.log(n)
    console.log(arr[n - 1])
    console.log(x)
    return x
  }
}
sum([1, 4, 6, 8, 15, 22, 3], 7) //?
