// What is the best way to get an Either from a TaskEither? I have a pipe of TaskEithers, and at the end I want to get the Either and write it to the console. I know I could call the TaskEither, and await the promise, but it doesn't feel very elegant

import { taskEither as TE, task as T, console as C } from "fp-ts";
import { pipe } from "fp-ts/function";

// declare const fetchTE: TE.TaskEither<

// pipe(TE.of(22), TE.chain)();

// // pipe(TE.of(22), async (r) => console.log(await r()))

const obj_ = {
  customerGroups: ["group1", "group2"],
  locales: ["en-GB", "en-US"],
  skus: ["fake-sku2"],
};

const flattedObjs = function* (obj: typeof obj_) {
  for (const customerGroup of obj.customerGroups)
    for (const locale of obj.locales)
      for (const sku of obj.skus) yield { customerGroup, locale, sku };
};

[...flattedObjs(obj_)]; //?
