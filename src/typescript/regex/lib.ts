import { Char, fromString } from "./Char"

type RE = (str: string) => Array<string>

function toArray(matches: RegExpMatchArray | null): Array<string> {
  matches
  return matches ? [matches[0]] : []
}

function r_(str: string): RegExp {
  return new RegExp(str)
}

function toRE(pat: string): RE {
  return str => toArray(str.match(r_(pat)))
}

// const char: (c: Char) => RE = c => toRE(c._A)
const char: (c: string) => RE = toRE
const anyChar: RE = toRE(".")
const cat: (re1: RE) => (re2: RE) => RE = re1 => re2 => str =>
  re1(str).concat(re2(str))
const optional: (re: RE) => RE = re => toRE(`${re}?`)
const either: (re1: RE) => (re2: RE) => RE = re1 => re2 => str =>
  re1(str) || re2(str)
const star: (re: RE) => RE = re => str => re()
const emptyMatch: RE = toRE("")
const fail: RE = _ => []

cat(char("a"))(anyChar)("abc") //?
either(char("b"))(anyChar)("abc") //?
