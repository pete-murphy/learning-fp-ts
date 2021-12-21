// const updateNTimes = (items, n) =>
//   Array.from(Array(n)).reduce((acc) => update(acc), items);

const update = s => s.concat("!")

const updateNTimes = (items, n) =>
  n === 0 ? items : updateNTimes(update(items), n - 1)
// Array.from(Array(n)).reduce((acc) => update(acc), items);

updateNTimes("foo", 3) //?
