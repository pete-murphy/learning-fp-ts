import * as D from "date-fns";

const jan30 = new Date(2024, 0, 30);
// console.log(jan30);
// console.log(D.subYears(jan30, 18));

function diffInDays18Years(date: Date) {
  return D.differenceInDays(date, D.subYears(date, 18));
}

const dates = [new Date(2023, 2, 1), new Date(2024, 2, 1)];

dates.forEach(date => {
  console.log(date, diffInDays18Years(date));
});
