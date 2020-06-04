import { option, record } from "fp-ts"
import { pipe } from "fp-ts/lib/pipeable"
import { Newtype, prism } from "newtype-ts"

const userId = "asdf"
const userNameById: Record<string, string> = { asdf: "Alice" }

export interface Email
  extends Newtype<{ readonly Email: unique symbol }, string> {}
const validEmailRE = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const isValidEmail = (str: string) => validEmailRE.test(str)

export const fromString = prism<Email>(isValidEmail).getOption

const mkUser = (email: Email) => (name: string) => ({
  email,
  name,
})

pipe(
  fromString("alice@hotmail.com"),
  option.map(mkUser),
  option.ap(record.lookup(userId, userNameById))
)
//-> { _tag: 'Some', value: { email: 'alice@hotmail.com', name: 'Alice' } }

pipe(
  fromString("alicehotmail.com"),
  option.map(mkUser),
  option.ap(record.lookup(userId, userNameById))
)
//-> { _tag: 'None' }

pipe(
  fromString("alice@hotmail.com"),
  option.map(mkUser),
  option.ap(record.lookup("someIdThatDoesntExist", userNameById))
)
//-> { _tag: 'None' }
