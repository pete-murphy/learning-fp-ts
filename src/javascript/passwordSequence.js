const lift2 = f => (arr1, arr2) => arr1.map(f).flatMap(g => arr2.map(g));
const sequence = arr => arr.reduce(lift2(a => b => [...a, b]), [[]]);

Array.prototype.apply = function(arr) {
  return this.reduce((acc, currFn) => [...acc, ...arr.map(currFn)], []);
};

[x => x + 1, x => x + 2, x => x * 100].apply([1, 2, 3]); //?

// https://blog.ploeh.dk/2018/10/15/an-applicative-password-list/
const variations = [
  ["P", "p"], // Did I capitalize the first letter?
  ["a", "4"], // Second letter could be either of these
  ["ssw"], // I'm sure about 'ssw'
  ["o", "0"], // Either of these
  ["rd"], // Definitely 'rd'
  ["", "!"] // Maybe ends in exclamation
];

// Show me all the possible combinations
console.log(sequence(variations).map(v => v.join(""))); //?
