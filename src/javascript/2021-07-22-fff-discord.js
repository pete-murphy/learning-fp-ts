// const filterBy = term => {
//   const searchTermLower = term.toLowerCase()
//   return person =>
//     Object.keys(person).some(
//       prop => person[prop].toLowerCase().indexOf(searchTermLower) !== -1
//     )
// }

const filterBy = (term, person) => {
  const searchTermLower = term.toLowerCase()
  return Object.keys(person).some(
    prop => person[prop].toLowerCase().indexOf(searchTermLower) !== -1
  )
}

const persons = [
  { name: "abc", number: "123456" },
  { name: "def", number: "44233" },
  { name: "xyz", number: "345345" },
  { name: "npe", number: "12312" },
]

const filterPerson = persons.filter(person => filterBy(searchTerm, person))
