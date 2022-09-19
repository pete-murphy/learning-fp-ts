import { reader, option, readonlyArray, traversable } from "fp-ts"
import { pipe, flow } from "fp-ts/function"

type BID = "BID"
type ModInput = "ModInput"
type BlockOption = option.Option<{ children: ReadonlyArray<BID> }>
type BlockOptionArray = ReadonlyArray<BlockOption>
declare const get: (bid: BID) => reader.Reader<ModInput, BlockOption>

export const _getChildren = (bid: BID): reader.Reader<ModInput, option.Option<BlockOptionArray>> =>
  pipe(
    bid,
    get,
    reader.chain(
      blockOption => readerInput =>
        pipe(
          blockOption,
          // option.map(({ children }) => children),
          // option.map(flow(readonlyArray.map(get), reader.sequenceArray)),
          option.map(flow(({ children }) => children, reader.traverseArray(get))),
          option.ap(option.of(readerInput))
        )
    )
  )

export const getChildren = (bid: BID): reader.Reader<ModInput, option.Option<BlockOptionArray>> =>
  pipe(
    bid,
    get,
    reader.chain(
      flow(
        option.map(({ children }) => children),
        option.map(reader.traverseArray(get)),
        option.sequence(reader.Applicative)
      )
    )
  )

/*

Not sure I'm following what the types of everything are, but
```ts
option.map(flow(readonlyArray.map(get), reader.sequenceArray)),
```
should be the same as
```ts
option.map(reader.traverseArray(get)),
```

```ts
option.map(({ children }) => children),
option.map(flow(readonlyArray.map(get), reader.sequenceArray)),
```
could be
```ts
option.map(flow(({ children }) => children, reader.traverseArray(get))),
```


*/
