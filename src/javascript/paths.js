/* eslint-disable no-prototype-builtins */
// @ts-check

/**
 * Extract a value from an object using a path
 *
 * @template T
 *
 * @param {object} object the input object
 * @param {string} path the path to the value in the object
 *
 * @returns {T}
 */
export function extract(object, path) {
  const path_ = path.split(".")
  if (!path_.every(isValidPathSegment)) {
    return null
  }
  let value = object
  for (const s of path_) {
    if (!value.hasOwnProperty(s)) return null
    value = value[s]
  }
  return value
}
function isValidPathSegment(str) {
  return /^\w+$/.test(str)
}

const team = { coach: { name: "Jane" }, name: "Hoop Masters" }

extract(team, "name") //?
// => "Hoop Masters"

extract(team, "coach.name") //?
// => "Jane"
