const currentBenefits = [
  {
    benefitStatus: "Missing information",
    benefitTitle: "Disturbance Expenses",
  },
  {
    benefitStatus: "Missing information",
    benefitTitle: "Forces Help to Buy Scheme",
  },
  {
    benefitStatus: "Missing information",
    benefitTitle: "Get You Home (Early Years)",
  },
]

const benefitUpdates = [
  { benefitStatus: "Eligible", benefitTitle: "Disturbance Expenses" },
  { benefitStatus: "Not Eligible", benefitTitle: "Forces Help to Buy Scheme" },
  {
    benefitStatus: "Missing information",
    benefitTitle: "Get You Home (Early Years)",
  },
]

benefitUpdates.filter(
  update =>
    !currentBenefits.some(
      benefit =>
        benefit.benefitStatus === update.benefitStatus &&
        benefit.benefitTitle === update.benefitTitle
    )
) //?
