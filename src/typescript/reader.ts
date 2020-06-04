import { reader } from "fp-ts/lib/Reader"
import { sequenceT, sequenceS } from "fp-ts/lib/Apply"

import { option, Option, some } from "fp-ts/lib/Option"
import { Newtype, prism } from "newtype-ts"
import { lookup } from "fp-ts/lib/Record"

export interface Email
  extends Newtype<{ readonly Email: unique symbol }, string> {}
const validEmailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (str: string) => validEmailRE.test(str)

export const fromString = prism<Email>(isValidEmail).getOption

const userId = "24"
const userNameById = {}

const userName: Option<string> = some("")
const userAge: Option<number> = some(44)
const userEmail: Option<Email> = fromString("")

sequenceS(option)({
  name: lookup(userId, userNameById),
  email: fromString("abc@"),
})
