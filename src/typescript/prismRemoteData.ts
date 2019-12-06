import { Prism, Lens } from "monocle-ts"
import {
  toOption,
  success,
  RemoteData,
  initial,
} from "@devexperts/remote-data-ts"

type SuccessType = string

const successPrism = new Prism<RemoteData<{}, SuccessType>, SuccessType>(
  toOption,
  success
)

type State = {
  data: RemoteData<{}, SuccessType>
}

const exampleInitial: State = {
  data: initial,
}

const exampleSuccess: State = {
  data: success("whooooo"),
}

const stateToDataLens = Lens.fromProp<State>()("data")
const stateToRemoteData = stateToDataLens.composePrism(successPrism)

const toUpper = (s: string) => s.toLocaleUpperCase()

stateToRemoteData.modify(toUpper)(exampleSuccess) //?
