```haskell
personFromId :: Int -> Maybe Person
personFromId id =
  { id, name: _, city: _ }
    <$> Map.lookup id nameById
    <*> Map.lookup id cityById
```
