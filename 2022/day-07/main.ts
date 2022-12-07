import {
  JUMP_LINE,
  MainProps,
  readInput,
  SPACE,
  sumReducer,
} from "../__core__";
import { logDebug, setDebug } from "../__core__/helpers/debug";

const CHANGE_DIRECTORY = "cd";
const LIST_DIRECTORY = "ls";
const MOVE_UP = "..";
const DIRECTORY_COMMAND = "dir";
const ROOT_ARG = "/";

const ROOT_DIRECTORY: Directory = {
  name: "/",
  parent: null,
  content: [],
  size: 0,
};

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  parent: Directory | null;
  content: (Directory | File)[];
  size: number;
};

type System = Directory;

type Input = System;

function evaluateChangeDirectoryArg(currentDirectory: Directory, arg: string) {
  const childrenDirectory = currentDirectory.content.find(
    ({ name }) => name === arg
  );

  if (childrenDirectory && "content" in childrenDirectory) {
    return childrenDirectory;
  }

  const newChildrenDirectory = {
    content: [],
    parent: currentDirectory,
    name: arg,
    size: 0,
  } as Directory;

  currentDirectory.content.push(newChildrenDirectory);

  return newChildrenDirectory;
}

type EvaluateRootCommandProps = {
  command: string;
  currentDirectory: Directory;
  rootDirectory: Directory;
};

function evaluateRootCommand({
  command,
  currentDirectory,
  rootDirectory,
}: EvaluateRootCommandProps): Directory {
  const [, operator, arg = ""] = command.split(SPACE);

  if (operator === LIST_DIRECTORY) {
    // Nothind to do for now
    return currentDirectory;
  }

  // Might not be necessary for now
  // if (operator === CHANGE_DIRECTORY)

  if (arg === MOVE_UP) {
    return currentDirectory?.parent ?? currentDirectory;
  } else if (arg === ROOT_ARG) {
    return rootDirectory;
  }

  return evaluateChangeDirectoryArg(currentDirectory, arg);
}

type EvaluateFileProps = {
  command: string;
  currentDirectory: Directory;
};

function evaluateFile({
  command,
  currentDirectory,
}: EvaluateFileProps): Directory {
  const [size, name] = command.split(SPACE);
  logDebug(command, { size, name });

  const file: File = { size: Number(size), name };
  currentDirectory.content.push(file);

  return currentDirectory;
}

function parseInput(content: string): Input {
  const rootDirectory = { ...ROOT_DIRECTORY };

  content.split(JUMP_LINE).reduce((currentDirectory, command) => {
    logDebug("Evaluating command", command);

    if (command.startsWith(DIRECTORY_COMMAND)) {
      logDebug('Is a "dir" command');
      return currentDirectory;
    }

    if (command.startsWith("$")) {
      logDebug("Is a root command");
      return evaluateRootCommand({
        currentDirectory,
        command,
        rootDirectory,
      });
    }

    logDebug("Is a file detail");
    return evaluateFile({ currentDirectory, command });
  }, rootDirectory as System);

  return rootDirectory;
}

function calculateDirectoriesSize(file: Directory | File): number {
  // is not a directory
  if (!("content" in file)) {
    return file.size;
  }

  let totalSize: number;
  if (file.size > 0) {
    totalSize = file.size;
  } else {
    totalSize = file.content
      .map((_file) => calculateDirectoriesSize(_file))
      .reduce(sumReducer, 0);
    file.size = totalSize;
  }

  return totalSize;
}

function getAllDirectories(
  root: Directory,
  directories: Directory[]
): Directory[] {
  root.content.forEach((directory) => {
    // is not a directory
    if (!("content" in directory)) {
      return;
    }

    directories.push(directory);
    getAllDirectories(directory, directories);
  });

  return directories;
}

function getAllDirectoriesUnder(root: System, atMost: number): Directory[] {
  const directories = [];
  getAllDirectories(root, directories);

  return directories.filter(({ size }) => size < atMost);
}

type GetSumDirectoriesProps = {
  atMost: number;
  root: System;
};

function getSumDirectories({ atMost, root }: GetSumDirectoriesProps): number {
  return getAllDirectoriesUnder(root, atMost)
    .map(({ size }) => size)
    .reduce(sumReducer, 0);
}

function main({ star, day, type }: MainProps) {
  setDebug(type === "example");

  const content = readInput({ star, day, type });

  const root = parseInput(content);
  logDebug("parsed", { root });

  calculateDirectoriesSize(root);
  logDebug("with sizes", { root });

  const power = getSumDirectories({ atMost: 100_000, root });

  switch (star) {
    case "first":
      return power;
    case "second":
      return root;
  }
}

// entrypoint
(() => {
  const result = main({ star: "first", day: 7, type: "test" });
  console.log({ result });
})();
