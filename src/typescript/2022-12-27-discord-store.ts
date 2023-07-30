import { pipe } from "fp-ts/lib/function";
import * as St from "fp-ts/lib/Store";

interface Product {
  id: number;
  name: string;
  price: number;
}

type ProductStore = St.Store<number, Product>;

const product: Product = {
  id: 1,
  name: "Apple",
  price: 0.99,
};

const store: ProductStore = { peek: _id => product, pos: 1 };

console.log(St.extract(store)); // { id: 1, name: 'Apple', price: 0.99 }
console.log(
  pipe(
    store,
    St.map(p => p.price * 2),
    St.extract,
  ),
); // 1.98
