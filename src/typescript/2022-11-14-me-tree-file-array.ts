export type File_ = {
  path: string;
  contents: string;
};

const files: ReadonlyArray<File_> = [
  {
    path: "app/src/App.tsx",
    contents: `import React from 'react'
import { WidgetList } from './WidgetList/WidgetList'
import featuredWidgets from '../data/featuredWidgets'
import clearanceWidgets from '../data/clearanceWidgets'
import discontinuedWidgets from '../data/discontinuedWidgets'

const widgets = featuredWidgets + clearanceWidgets + discontinuedWidgets

export const App = () => {
  return (
    <div>
      <h1>Widgets R Us</h1>
      <WidgetList widgets={widgets} />
    </div>
  )
}`,
  },
  {
    path: "app/data/featuredWidgets.js",
    contents: `export default [
  { name: 'spadoink', price: 777 },
  { name: 'kafloof', price: 1326 },
  { name: 'sweezil', price: 966 }
]`,
  },
  {
    path: "app/data/discontinuedWidgets.js",
    contents: `export default [
  { name: 'neewumps', price: 138 },
  { name: 'snarcap', price: 5873 },
  { name: 'topwolly', price: 83 }
]`,
  },
  {
    path: "app/style.css",
    contents: `body, html {
  height: 100%;
  width: 100%;
  font-family: comic-sans;
  font-size: 1rem;
  background: limegreen;
}`,
  },
  {
    path: "app/data/clearanceWidgets.js",
    contents: `export default [
  { name: 'plonches', price: 839 },
  { name: 'chopfle', price: 7743 },
  { name: 'kazkabo', price: 9133 }
]`,
  },
  {
    path: "app/src/WidgetList/Widget.tsx",
    contents: `import React from 'react'

export const Widget = ({ widget }) => {
  return (
    <div>
      <b>Widget: {widget.name}</b>
      <span>\${widget.price / 1000.0}</span>
    </div>
  )
}`,
  },
  {
    path: "app/src/WidgetList/WidgetList.tsx",
    contents: `import React from 'react'
import { Widget } from './Widget'

export const WidgetList = ({ widgets }) => {
  return (
    <ul>
      {widgets.map((widget) => {
        return (
          <li key={widget.name}>
            <Widget widget={widget} />
          </li>
        )
      })}
    </ul>
  )
}`,
  },
  {
    path: "app/index.html",
    contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <title>React | CoderPad</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/App.tsx"></script>
    <script type="module" src="/style.css"></script>
  </body>
</html>`,
  },
];

type File = {
  name: string;
  contents: string;
};

type Directories = ReadonlyArray<Directory>;
type Directory = {
  name: string;
  directories: Directories;
  files: ReadonlyArray<File>;
};

const insertFileAtDir =
  (dirName: string) =>
  (file: File) =>
  (directories: Directories): Directories => {
    const i = directories.findIndex(dir => dir.name === dirName);
    if (i === -1) {
      // directory is new
      return directories.concat({
        name: dirName,
        files: [file],
        directories: [],
      });
    }
    const dir = directories[i];
    const out = directories.slice().splice(i, 1);
    return out.concat({ ...dir, files: dir.files.concat(file) });
  };

const mkdirp =
  (path: ReadonlyArray<string>) =>
  (directories: Directories): Directories => {
    if (path.length === 0) {
      return directories;
    }
    const [dirName, ...restPath] = path;
    const i = directories.findIndex(dir => dir.name === dirName);
    if (i === -1) {
      const go = (p_: ReadonlyArray<string>): Directory => {
        if (p_.length === 1) {
          return { directories: [], name: p_[0], files: [] };
        }
        return { directories: [go(p_.slice(1))], name: p_[0], files: [] };
      };
      return directories.concat(go(path));
    }
    const directories_ = directories.slice().splice(i, 1);
    const dir = directories[i];
    return directories_.concat({
      ...dir,
      directories: mkdirp(restPath)(dir.directories),
    });
  };
// const mkdirp =
//   (path: ReadonlyArray<string>) =>
//   (directories: Directories): Directories => {
//     if (path.length === 0) {
//       return directories;
//     }
//     const [dirName, ...restPath] = path;
//     const i = directories.findIndex(dir => dir.name === dirName);
//     if (i === -1) {
//       const go = (p_: ReadonlyArray<string>): Directory => {
//         if (p_.length === 1) {
//           return { directories: [], name: p_[0], files: [] };
//         }
//         return { directories: [go(p_.slice(1))], name: p_[0], files: [] };
//       };
//       return directories.concat(go(path));
//     }
//     const directories_ = directories.slice().splice(i, 1);
//     const dir = directories[i];
//     return directories_.concat({
//       directories: dir.directories.concat(mkdirp(restPath)(dir.directories)),
//       files: dir.files,
//       name: dir.name,
//     });
//   };

const drawDir = (dir: Directory): string => {
  return `${dir.name}\n`.concat(
    dir.directories
      .map(drawDir)
      .map(s => `  ${s}`)
      .join(""),
  );
};

const d = mkdirp(["foo", "bar", "baz"])([]);
// d.map(drawDir).join('') //?
const d_ = mkdirp(["foo"])(d);
d_.map(drawDir).join(""); //?

// d_;

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
