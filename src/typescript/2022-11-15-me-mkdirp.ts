interface Directory extends Record<string, Directory> {}

const drawDir = (dir: Directory, prefix = ""): string => {
  const entries = Object.entries(dir);
  return entries
    .map(([dirName, subDirs]) =>
      `${prefix}${dirName}\n`.concat(
        drawDir(subDirs, prefix === "" ? "- " : "  " + prefix),
      ),
    )
    .join("");
};

drawDir({
  foo: {
    bar: {
      baz: {},
    },
  },
  quux: {
    quuz: {},
    q: {
      doo: {
        doo: {
          dah: {},
        },
      },
    },
  },
}); //?

const mkdirp =
  (paths: ReadonlyArray<string>) =>
  (dir: Directory): Directory => {
    if (paths.length === 0) {
      return dir;
    }
    const p = paths[0];
    return { ...dir, [p]: mkdirp(paths.slice(1))(dir[p] ?? {}) };
  };

const d1 = mkdirp(["foo", "bar", "baz"])({}); //?
const d2 = mkdirp(["foo", "bar", "quux"])(d1);
d2;
const d3_ = mkdirp(["quuz", "x"])(d2);
d3_; //?

// type IndexedTree<I, A> = {
//   readonly index: I;
//   readonly node: A;
//   readonly forest: IndexedForest<I,A>;
// };

// type IndexedForest<I, A> = ReadonlyArray<IndexedTree<I, A>>

// const insertAtIndex =
//   <I>(i: I) =>
//   <A>(a: A) =>
//   (
//     forest: IndexedForest<I,A>,
//   ): IndexedForest<I,A> => {
//     const j = forest.findIndex(node => node.index === i);
//     if (j === -1) {
//       return forest.concat({ index: i, node: a, forest: [] });
//     }
//     const out = forest.slice().splice(j, 1);
//     return out.concat({ index: i, node: a, forest: [] });
//   };

// const insertAtPath = <I>(path: ReadonlyArray<I>) => <A>(a: A) => (tree: IndexedTree<I, A>): IndexedTree<I, A> => {

// }
