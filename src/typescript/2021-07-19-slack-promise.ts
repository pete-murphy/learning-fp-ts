import * as TO from "fp-ts/TaskOption"
import { flow, O, pipe, T } from "./lib/fp-ts-imports"

type NewData = { title: string; version: number }
type Payload = {
  title: string
  version: { number: number }
  otherStuffFromTheAPI: string
}
declare const callAPI: (
  url: string
) => TO.TaskOption<Payload>

// callAPIImplementation
const getTitleOr: (
  backupTitle: string
) => (data: O.Option<Payload>) => string =
  backupTitle => data =>
    pipe(
      data,
      O.chainNullableK(obj => obj.title),
      O.getOrElse(() => backupTitle)
    )

const getVersionNumberOr1: (
  data: O.Option<Payload>
) => number = flow(
  O.chainNullableK(obj => obj.version),
  O.chainNullableK(version => version.number),
  O.getOrElse(() => 1)
)

const createNewData: (
  backupTitle: string,
  url: string
) => Promise<NewData> = (backupTitle, url) =>
  pipe(
    callAPI(url),
    T.map(payloadOption => ({
      title: getTitleOr(backupTitle)(payloadOption),
      version: getVersionNumberOr1(payloadOption)
    })),
    task => task()
  )
