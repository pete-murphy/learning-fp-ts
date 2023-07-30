interface CancellablePromise<A> extends Promise<A> {
  cancel(): void;
}

// This doesn't work
function fromPromise<A>(p: Promise<A>): CancellablePromise<A> {
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  return {
    cancel,
    then: (onFulfilled, onRejected) => {
      if (cancelled) {
        return Promise.reject(new Error("cancelled"));
      }
      return p.then(onFulfilled, onRejected);
    },
    catch: onRejected => {
      if (cancelled) {
        return Promise.reject(new Error("cancelled"));
      }
      return p.catch(onRejected);
    },
    finally: onFinally => {
      if (cancelled) {
        return Promise.reject(new Error("cancelled"));
      }
      return p.finally(onFinally);
    },
    [Symbol.toStringTag]: "CancellablePromise",
  };
}

// Instead, we need to pass in a canceller
function fromPromise_<A>(
  p: Promise<A>,
  cancel: () => void,
): CancellablePromise<A> {
  return {
    cancel,
    then: p.then.bind(p),
    catch: p.catch.bind(p),
    finally: p.finally.bind(p),
    [Symbol.toStringTag]: "CancellablePromise",
  };
}

// const main = async () => {
//   const [a, b, c] = await Promise.all([
//     Promise.resolve(1),
//     Promise.resolve(2),
//     Promise.resolve(3),
//   ]);
//   const p = Promise.resolve(1);
//   console.log(a, b, c);
// };
