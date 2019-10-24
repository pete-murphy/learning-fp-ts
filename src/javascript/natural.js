const zero = undefined;
const succ = n => [n];

const toInt = n => (n === zero ? 0 : 1 + toInt(...n));
const fromInt = n => (n === 0 ? zero : succ(fromInt(n - 1)));

toInt(succ(zero));
//-> 1
toInt(succ(succ(zero)));
//-> 2

fromInt(100);
//-> [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[null]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
