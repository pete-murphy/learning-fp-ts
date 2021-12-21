const vowels = ["a", "e", "i", "o", "u"]
const containsPredicate = (match: string) => (s: string) => s.includes(match)
const data = [
  "hello",
  "my",
  "name",
  "is",
  "zach",
  "why",
  "do",
  "you",
  "ask",
  "?",
]

const not =
  (pred: (match: string) => (s: string) => boolean) =>
  (match: string) =>
  (s: string): boolean =>
    !pred(match)(s)

const filters = vowels.map(not(containsPredicate))

const finalFilter = filters.reduce(
  (aggregate, current) => (s: string) => aggregate(s) || current(s),
  s => false
)

console.log(data.filter(finalFilter))
