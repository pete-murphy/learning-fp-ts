// const main = () => {
//   try {
//     const nextButton = null
//     nextButton.click()
//     console.log("successful")
//   } catch (e) {
//     console.log(e)
//   }
// }

const main = async () => {
  try {
    const nextButton = Promise.resolve(null)
    await nextButton.click()
    console.log("successful")
  } catch (e) {
    console.log(e)
  }
}

main()
// mainAsync()
