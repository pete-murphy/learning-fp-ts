```typescript
const personFromId = (id: number): Option<Person> =>
  pipe(
    (name: string) => (city: string) => ({ id, name, city }),
    f => option.map(Record.lookup(id, nameById), f),
    g => option.ap(g, Record.lookup(id, cityById))
  )
```
