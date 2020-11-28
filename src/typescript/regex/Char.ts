import { Newtype, prism } from "newtype-ts"
import { escapeRegExp } from "lodash"

export interface Char
  extends Newtype<{ readonly Char: unique symbol }, string> {}
const isChar = (str: string) => escapeRegExp(str).length === 1

export const fromString = prism<Char>(isChar).getOption
