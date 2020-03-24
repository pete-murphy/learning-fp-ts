```haskell
personFromId :: Int -> Maybe Person
personFromId id =
  sequenceRecord
    { id: Just id
    , name: Map.lookup id nameById
    , city: Map.lookup id cityById
    }
```
