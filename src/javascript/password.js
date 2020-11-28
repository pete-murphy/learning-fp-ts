// passwords :: [String]
// passwords = sequenceA (map (\c -> [c, toUpper c]) "password")

const sequence = xss =>
  xss.reduceRight((acc, xs) =>
    xs.map(x => ys => [x, ...ys]).flatMap(f => acc.map(f))
  )

const passwords = sequence([
  ["p", "P"],
  ["a", "A", "4"],
  ["s", "S", "5"],
  ["s", "S", "5"],
  ["w", "W"],
  ["o", "O", "0"],
  ["r", "R"],
  ["d", "D"],
]).map(c => c.join(""))
// ['password', 'passworD', 'passwoRd', 'passwoRD', 'passwOrd', ...]
