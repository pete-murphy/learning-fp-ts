```typescript
const personFromId = (id: number): Option<Person> =>
  pipe(Record.lookup(id, nameAndCityIdByNameId), nameAndCityOption =>
    option.chain(nameAndCityOption, ({ name, cityId }) =>
      pipe(Record.lookup(cityId, cityById), cityOption =>
        option.map(cityOption, city => ({
          id,
          name,
          city,
        }))
      )
    )
  )
```
