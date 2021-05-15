import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/Array"

type ChickenletTask = {}
const makeChickenletTaskInfo = (str: string) => ({})

const numInfoTasksPerChain = 0

const makeChickenletTaskInfos = (): Array<ChickenletTask> =>
  pipe(
    Array.from<unknown>({ length: numInfoTasksPerChain }),
    A.mapWithIndex<unknown, ChickenletTask>(i =>
      makeChickenletTaskInfo(i.toLocaleString())
    )
  )

const makeChickenletTaskInfos_ = (): Array<ChickenletTask> =>
  pipe(
    A.makeBy(numInfoTasksPerChain, i =>
      makeChickenletTaskInfo(i.toLocaleString())
    )
  )

makeChickenletTaskInfos() //?
makeChickenletTaskInfos_() //?
