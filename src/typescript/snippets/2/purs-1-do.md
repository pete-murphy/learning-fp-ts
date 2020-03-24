```haskell
personFromId :: Int -> Maybe Person
personFromId id = do
  name <- Map.lookup id nameById
  city <- Map.lookup id nameById
  pure { id, name, city }
```
