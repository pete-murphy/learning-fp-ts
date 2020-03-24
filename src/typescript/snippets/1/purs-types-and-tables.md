```haskell
type Person
  = { id :: Int
    , name :: String
    , city :: String
    }

nameById :: Map Int String
nameById =
  Map.fromFoldable
    [ 1 /\ "Alice"
    , 2 /\ "Bob"
    , 3 /\ "Carol"
    , 4 /\ "Dave"
    ]

cityById :: Map Int String
cityById =
  Map.fromFoldable
    [ 1 /\ "Boston"
    , 2 /\ "Chicago"
    , 3 /\ "Miami"
    ]
```
