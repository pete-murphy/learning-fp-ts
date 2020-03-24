```typescript
const personFromId = (id: number): Option<Person> =>
  Do(option)
    .bind("name", Record.lookup(id, nameById))
    .bind("city", Record.lookup(id, cityById))
    .return(({ name, city }) => ({ id, name, city }))
```
