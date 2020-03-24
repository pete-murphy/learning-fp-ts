```typescript
const personFromId = (id: number): Option<Person> =>
  Do(option)
    .bind("nameAndCity", Record.lookup(id, nameAndCityIdByNameId))
    .bindL("city", ({ nameAndCity }) =>
      Record.lookup(nameAndCity.cityId, cityById)
    )
    .return(({ nameAndCity, city }) => ({ id, name: nameAndCity.name, city }))
```
