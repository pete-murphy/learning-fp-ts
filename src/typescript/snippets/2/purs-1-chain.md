```haskell
personFromId :: Int -> Maybe Person
personFromId id =
  Map.lookup id nameById
    >>= \name ->
        Map.lookup id cityById
          <#> \city ->
              { id, name, city }
```
