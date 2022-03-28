import { pipe, RA, RR } from "./lib/fp-ts-imports"
import { tuple } from "fp-ts/lib/function"

type CategorizedInventoryItem = {
  readonly category_name: string
} & InventoryItem

type InventoryItem = {
  readonly cf_technology_unformatted: string
} & Item

type Item = {
  readonly item_name: string
  readonly item_id: string
}

const input: ReadonlyArray<CategorizedInventoryItem> = [
  {
    category_name: "A",
    cf_technology_unformatted: "foo",
    item_name: "itemName1",
    item_id: "es51a"
  },
  {
    category_name: "B",
    cf_technology_unformatted: "foo2",
    item_name: "itemName2",
    item_id: "jak1k"
  },
  {
    category_name: "A",
    cf_technology_unformatted: "foo4",
    item_name: "itemName3",
    item_id: "cxa1az"
  },
  {
    category_name: "A",
    cf_technology_unformatted: "foo4",
    item_name: "itemName3",
    item_id: "cxa1az"
  }
]

const expectedOutput = {
  A: {
    foo: [
      {
        item_id: "es51a",
        item_name: "itemName1"
      }
    ],
    foo4: [
      {
        item_id: "cxa1az",
        item_name: "itemName3"
      },
      {
        item_id: "cxa1az",
        item_name: "itemName3"
      }
    ]
  },
  B: {
    foo2: [
      {
        item_id: "jak1k",
        item_name: "itemName2"
      }
    ]
  }
}

pipe(
  RR.fromFoldableMap(
    RA.getSemigroup<InventoryItem>(),
    RA.Foldable
  )(
    input,
    ({
      category_name,
      cf_technology_unformatted,
      item_id,
      item_name
    }) =>
      tuple(category_name, [
        {
          cf_technology_unformatted,
          item_id,
          item_name
        }
      ])
  ),
  RR.map(xs =>
    RR.fromFoldableMap(
      RA.getSemigroup<Item>(),
      RA.Foldable
    )(xs, ({ cf_technology_unformatted, ...item }) =>
      tuple(cf_technology_unformatted, [item])
    )
  )
) //?

pipe(
  RR.fromFoldableMap(
    RA.getSemigroup<InventoryItem>(),
    RA.Foldable
  )(input, x =>
    tuple(x.category_name, [
      pipe(x, RR.deleteAt("category_name"))
    ])
  ),
  RR.map(xs =>
    RR.fromFoldableMap(
      RA.getSemigroup<Item>(),
      RA.Foldable
    )(xs, x =>
      tuple(x.cf_technology_unformatted, [
        pipe(x, RR.deleteAt("cf_technology_unformatted"))
      ])
    )
  )
) //?
