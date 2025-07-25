import fs from "node:fs";
import path from "node:path";

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const flattenArray = (input: any) =>
  input.reduce(
    (acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])],
    [],
  );

const map = (fn) => (input) => input.map(fn);

const walkDir = (fullPath: string) => {
  return fs.statSync(fullPath).isFile()
    ? fullPath
    : getAllFilesRecursively(fullPath);
};

const pathJoinPrefix = (prefix: string) => (extraPath: string) =>
  path.join(prefix, extraPath);

const getAllFilesRecursively = (folder: string): string[] =>
  pipe(
    fs.readdirSync,
    map(pipe(pathJoinPrefix(folder), walkDir)),
    flattenArray,
  )(folder);

export const files = getAllFilesRecursively;
