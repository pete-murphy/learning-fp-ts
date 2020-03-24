```haskell
personFromId :: Int -> Maybe Person
personFromId id = do
  { name, cityId } <- Map.lookup id nameAndCityIdByNameId
  city <- Map.lookup cityId cityNameById
  pure { id, name, city }
```
