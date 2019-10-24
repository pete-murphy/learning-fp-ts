function* foo() {
  let a;
  a = yield "2";
  yield a;
  let b;
  b = yield a;
  return a;
}

function* goo() {
  let i = 0;
  while (i < 100) {
    yield i;
    i++;
  }
}

const bar = foo();
const baz = goo();

[...baz]; //?
[...bar]; //?

// bar.next(123); //?
// bar.next(); //?
// bar.next(); //?
// bar.next(); //?
// baz.next(123); //?
// baz.next(); //?
// baz.next(); //?
// baz.next(); //?

async function roo() {
  const a = await 2;
  const b = (await a) + 1;
  return b;
}
const quuxxxxx = roo();
quuxxxxx;

const button = document.querySelector("button");

(function main(clicks = 0) {
  clicks === 3
    ? alert("Clicked thrice!")
    : button.onClick(() => main(clicks + 1));
})();
