const teams = [
  {
    name: "Liverpool",
    id: "1",
    categories: ["Prem League"],
  },
  { name: "Man Utd", id: "2", categories: ["Blue Square"] },
  {
    name: "Sheff Utd",
    id: "2",
    categories: ["Prem League"],
  },
]

// Ramda
// const getTeamOptions = pipe(
//   filter(
//     pipe(
//       prop('categories'),
//       includes('Prem League')
//     )
//   ),
//   map(
//     pipe(
//       props(['name', 'id']),
//       zipObj(['label', 'value'])
//     )
//   )
// )

console.log(getTeamOptions(teams))
