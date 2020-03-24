```haskell
personFromId :: Int -> Maybe Person
personFromId id =
  Map.lookup id nameAndCityIdByNameId
    >>= \{ name, cityId } ->
        Map.lookup cityId cityNameById
          <#> \city ->
              { id, name, city }
```
