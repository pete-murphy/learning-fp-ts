import { Future, Option } from "prelude-ts"
import fetch from "node-fetch"

const GOOD_URL = "https://jsonplaceholder.typicode.com/todos/1"
const BAD_URL = ""

type Todo = {
  userId: number
  id: number
  title: string
  completed: boolean
}

const successfulFuture: Future<Option<Todo>> = Future.ofPromiseCtor(
  (resolve, _reject) => {
    fetch(GOOD_URL)
      .then((res) => res.json())
      .then(Option.of)
      .catch(Option.none)
      .then(resolve)
  }
)

const unsuccessfulFuture: Future<Option<Todo>> = Future.ofPromiseCtor(
  (resolve, _reject) => {
    fetch(BAD_URL)
      .then((res) => res.json())
      .then(Option.of)
      .catch(Option.none)
      .then(resolve)
  }
)

successfulFuture.then(console.log)
//-> Logs `Some({"userId":1,"id":1,"title":"delectus aut autem","completed":false})`
unsuccessfulFuture.then(console.log)
//-> Logs `None()`
