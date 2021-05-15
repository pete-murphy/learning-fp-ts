const p1 = new Promise((resolve, _reject) => setTimeout(resolve("p1"), 10_000))
const p2 = new Promise((resolve, _reject) => setTimeout(resolve("p2"), 10_000))
const p3 = new Promise((_resolve, reject) => setTimeout(reject("p3"), 0))

const run = () => {
  console.time("run")
  Promise.all([p1, p2, p3])
    .then(res => {
      console.log(res)
      console.timeEnd("run")
    })
    .catch(err => {
      console.log(err)
      console.timeEnd("run")
    })
}

run()
