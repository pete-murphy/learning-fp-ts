// write a function that accepts a target string and an array of strings
// The function should return the number of ways that the target can be constructed by concatenating elements of the wordBank array
// The elements of wordBank may be used as many times as needed

function countConstruct(
  target,
  wordBank,
  memo = {},
  i = 0,
  totalCount = 0,
  len = wordBank.length
) {
  // anchor
  if (i < len) {
    // if we've already checked this target
    // return the numerical value
    if (memo[target] !== undefined) {
      return memo[target]
    }
    // if the target is an empty string
    // this means that a combination in the wordBank can construct the word
    if (target === "") {
      // there is at least one possibility of constructing the word with the given wordBank
      totalCount = totalCount + 1
      return totalCount
    }
    // if the target contains these chars in the beginning of the word
    if (target.indexOf(wordBank[i]) === 0) {
      // remove these chars from the word
      const suffix = target.slice(wordBank[i].length)
      // check if there is a repeat of the current chars in the suffix
      const numWaysForRest = countConstruct(suffix, wordBank, memo)
      // increment number of possibilities
      totalCount = totalCount + numWaysForRest
    }
    // if those chars are not in the front of the word, check the next pair of chars against the target.
    return countConstruct(target, wordBank, memo, i + 1, totalCount)
  }
  // remember the number of ways found with the target as reference
  memo[target] = totalCount
  return totalCount
}
