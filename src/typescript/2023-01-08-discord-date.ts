import { O, pipe } from "./lib/fp-ts-imports";

export function apiDateStringToDate(dateString: string | null) {
  return pipe(
    O.fromNullable(dateString),
    O.map(data => new Date(data.replace(" ", "T"))),
    O.chain(O.fromPredicate(date => !isNaN(date.getTime()))),
    x => x, // (parameter) x: O.Option<Date>
    O.toNullable,
  );
}

// function now infers a return value of Date instead of Date | null....

export function apiDateStringToDate_(dateString: string | null) {
  return pipe(
    O.fromNullable(dateString),
    O.map(data => new Date(data.replace(" ", "T"))),
    O.chain(O.fromPredicate(date => !isNaN(date.getTime()))),
    O.foldW(
      () => null,
      date => date,
    ),
  );
}

// return signature of foldW is [const foldW: <any, Date, Date>(onNone: Lazy<any>, onSome: (a: Date) => Date) => (ma: O.Option<Date>) => any]
