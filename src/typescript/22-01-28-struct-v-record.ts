type UUID = string

type User = {
  id: string
  name: string
  age: number
  likesDogs: boolean
}

type UserNamesById = Record<string, string>
