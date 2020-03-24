```typescript
const personFromId = (id: number): Option<Person> =>
  pipe(Record.lookup(id, nameById), nameOption =>
    option.chain(nameOption, name =>
      pipe(Record.lookup(id, cityById), cityOption =>
        option.map(cityOption, city => ({
          id,
          name,
          city,
        }))
      )
    )
  )
```
