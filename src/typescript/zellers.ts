type ZellerInputs = {
  q: number;
  m: number;
  K: number;
  J: number;
};

const div = (x: number, y: number) => Math.floor(x / y);
const mod = (x: number, y: number) => x - y * div(x, y);
const divMod = (x: number, y: number) => [div(x, y), mod(x, y)];

export const zellersCongruence = ({ q, m, K, J }: ZellerInputs): number =>
  mod(q + div(13 * (m + 1), 5) + K + div(K, 4) + div(J, 4) - 2 * J, 7);

export const zellerInputsFromYMD = (
  year: number,
  month: number,
  day: number
): ZellerInputs => {
  const [m, J, K] =
    month > 2
      ? [month, ...divMod(year, 100)]
      : [month + 12, ...divMod(year - 1, 100)];
  return { q: day, m, J, K };
};

export const ymdFromDate = (d: Date): [number, number, number] => [
  d.getFullYear(),
  d.getMonth() + 1,
  d.getDate()
];
export const toJSDay = (h: number) => mod(h + 6, 7);

const z = (d: Date) =>
  toJSDay(zellersCongruence(zellerInputsFromYMD(...ymdFromDate(d))));

z(new Date("01 01 2019")); //?
z(new Date("10 26 2019")); //?
z(new Date("10 27 2019")); //?
