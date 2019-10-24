import * as t from "io-ts";
import fetch from "node-fetch";
import { either, bimap } from "fp-ts/lib/Either";
import { map as mapRecord } from "fp-ts/lib/Record";
import { fromArray } from "fp-ts/lib/NonEmptyArray";

const Data = t.type({
  userId: t.number,
  name: t.string
});

const foaao = {
  userId: 90,
  name: "Alice"
};

Data.decode(foaao); //

const Result = t.type({
  message: t.record(t.string, t.array(t.string))
});

type Result = t.TypeOf<typeof Result>;

const resultToBreedRecord = (res: Result) => mapRecord(fromArray)(res.message);
const foo = bimap((e: t.Errors) => "Something went wrong", resultToBreedRecord);

const res = fetch("https://dog.ceo/api/breeds/list/all")
  .then(res => (res.ok ? res.json() : res.statusText), err => err)
  .then(Result.decode)
  .then(foo);

res; //?
