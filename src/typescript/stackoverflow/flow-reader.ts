import { IO } from "fp-ts/IO"
import { flow, pipe } from "fp-ts/lib/function"
import * as Rd from "fp-ts/Reader"
import * as RT from "fp-ts/ReaderTask"
import Reader = Rd.Reader

type EnvVars = {
  account: string
  region: string
}

const readEnvVars: IO<EnvVars> = () => ({ account: "123", region: "456" })

// const flowReader: Reader<IO<envVars>, envVars & unknown> = pipe(
//   bind("foo", ({ account }) => of("foo" + account)),
//   apS("bar", of("bar"))
// )

const flowReader = pipe(
  Rd.ask<EnvVars>(),
  Rd.map(envVars => ({ ...envVars, foo: "foo" + envVars.account, bar: "bar" }))
)

flowReader(readEnvVars())
// {account: "123", region: "456", foo: "foo123", bar: "bar"}

// flowReader()(readEnvVars)
// {account: "123", region: "456", foo: "foo123", bar: "bar"}

// flowReader(readEnvVars)() yields
// {account: "123", region: "456", foo: "foo123", bar: "bar"}
