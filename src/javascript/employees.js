const employees = [
  {
    employeeId: 1,
    firstName: "Amalie",
    lastName: "Ivins",
    reports: [
      {
        employeeId: 2,
        firstName: "Tabina",
        lastName: "Dugmore",
        reports: []
      },
      {
        employeeId: 3,
        firstName: "Lucias",
        lastName: "Ludlamme",
        reports: []
      },
      {
        employeeId: 4,
        firstName: "Aurlie",
        lastName: "Gottelier",
        reports: [
          {
            employeeId: 5,
            firstName: "Manda",
            lastName: "Ecclesall",
            reports: []
          },
          {
            employeeId: 6,
            firstName: "Tyne",
            lastName: "Portwaine",
            reports: []
          },
          {
            employeeId: 7,
            firstName: "Myca",
            lastName: "Lipmann",
            reports: []
          },
          {
            employeeId: 8,
            firstName: "Sadie",
            lastName: "Egglestone",
            reports: []
          }
        ]
      }
    ]
  },

  {
    employeeId: 9,
    firstName: "Ritchie",
    lastName: "Turbern",
    reports: [
      {
        employeeId: 10,
        firstName: "Hervey",
        lastName: "Geany",
        reports: []
      },
      {
        employeeId: 11,
        firstName: "Bobbi",
        lastName: "Dawks",
        reports: [
          {
            employeeId: 12,
            firstName: "Kris",
            lastName: "Gaskin",
            reports: [
              {
                employeeId: 13,
                firstName: "Sharona",
                lastName: "Cornborough",
                reports: []
              },
              {
                employeeId: 14,
                firstName: "Candace",
                lastName: "Gloves",
                reports: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    employeeId: 15,
    firstName: "Winthrop",
    lastName: "Inglefield",
    reports: [
      {
        employeeId: 16,
        firstName: "Lillian",
        lastName: "Koschek",
        reports: []
      },
      {
        employeeId: 17,
        firstName: "Sam",
        lastName: "Dossett",
        reports: [
          {
            employeeId: 18,
            firstName: "Farrah",
            lastName: "Walker",
            reports: []
          },
          {
            employeeId: 19,
            firstName: "Blake",
            lastName: "Lamplough",
            reports: []
          },
          {
            employeeId: 20,
            firstName: "Maribeth",
            lastName: "Patifield",
            reports: []
          },
          {
            employeeId: 21,
            firstName: "Connor",
            lastName: "Graybeal",
            reports: []
          },
          {
            employeeId: 22,
            firstName: "Shaun",
            lastName: "MacDonell",
            reports: []
          },
          {
            employeeId: 23,
            firstName: "Katina",
            lastName: "Stollsteimer",
            reports: []
          }
        ]
      }
    ]
  },
  {
    employeeId: 24,
    firstName: "Richie",
    lastName: "Brane",
    reports: [
      {
        employeeId: 25,
        firstName: "Kaspar",
        lastName: "Normanville",
        reports: []
      },
      {
        employeeId: 26,
        firstName: "Roselle",
        lastName: "Cammell",
        reports: []
      },
      {
        employeeId: 27,
        firstName: "Ysabel",
        lastName: "McBeath",
        reports: []
      }
    ]
  },
  {
    employeeId: 28,
    firstName: "Roanna",
    lastName: "Davenhill",
    reports: [
      {
        employeeId: 29,
        firstName: "Edd",
        lastName: "Wollaston",
        reports: []
      },
      {
        employeeId: 30,
        firstName: "Meggi",
        lastName: "Eastup",
        reports: []
      }
    ]
  }
];

const countReports = es =>
  es.reduce((acc, e) => acc + 1 + countReports(e.reports), 0);

countReports(employees); //?
