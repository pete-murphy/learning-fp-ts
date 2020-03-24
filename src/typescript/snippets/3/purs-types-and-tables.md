```haskell
data City
  = BOS
  | MIA
  | CHI

derive instance eqCity :: Eq City
derive instance ordCity :: Ord City

nameAndCityIdByNameId :: Map Int { name :: String, cityId :: City }
nameAndCityIdByNameId =
  Map.fromFoldable
    [ 1 /\ { name: "Alice", cityId: BOS }
    , 2 /\ { name: "Bob", cityId: MIA }
    , 3 /\ { name: "Carol", cityId: CHI }
    , 4 /\ { name: "Dave", cityId: BOS }
    ]

cityNameById :: Map City String
cityNameById =
  Map.fromFoldable
    [ BOS /\ "Boston"
    , CHI /\ "Chicago"
    , MIA /\ "Miami"
    ]
```
