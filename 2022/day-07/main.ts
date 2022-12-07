import {
  JUMP_LINE,
  logDebug,
  MainProps,
  minReducer,
  readInput,
  setDebug,
  SPACE,
  sumReducer,
} from "../__core__";

const CHANGE_DIRECTORY = "cd";
const LIST_DIRECTORY = "ls";
const MOVE_UP = "..";
const DIRECTORY_COMMAND = "dir";
const ROOT_ARG = "/";

const TOTAL_FILESYSTEM_SPACE = 70_000_000;
const UPDATE_REQUIRED_SPACE = 30_000_000;

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

  // If it's not a change of directory, it's an unknown operation
  if (operator !== CHANGE_DIRECTORY) {
    return rootDirectory;
  }

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

type GetAllDirectoriesWithThresholdProps = {
  root: System;
  threshold: number;
  under: boolean;
};

function getAllDirectoriesWithThreshold({
  root,
  threshold,
  under,
}: GetAllDirectoriesWithThresholdProps): Directory[] {
  return getAllDirectories(root, []).filter(({ size }) =>
    under ? size < threshold : size > threshold
  );
}

type GetSumDirectoriesProps = {
  threshold: number;
  root: System;
};

function getTotalSizeOfDirs(dirs: Directory[]): number {
  return dirs.map(({ size }) => size).reduce(sumReducer, 0);
}

function getSumDirectories({
  threshold,
  root,
}: GetSumDirectoriesProps): number {
  return getTotalSizeOfDirs(
    getAllDirectoriesWithThreshold({ root, threshold, under: false })
  );
}

function getAllFileSizes(root: Directory, fileSizes: number[]): number[] {
  root.content.forEach((file) => {
    // is not a directory
    if (!("content" in file)) {
      return fileSizes.push(file.size);
    }

    getAllFileSizes(file, fileSizes);
  });

  return fileSizes;
}

function getFolderToFreeSpace(root: Directory): number {
  const totalSize = getAllFileSizes(root, []).reduce(sumReducer, 0);

  const unusedSpace = TOTAL_FILESYSTEM_SPACE - totalSize;
  const requiredSpace = UPDATE_REQUIRED_SPACE - unusedSpace;

  const candidateDirectories = getAllDirectoriesWithThreshold({
    threshold: requiredSpace,
    root,
    under: false,
  });

  const smallestDirectorySize = candidateDirectories
    .map(({ size }) => size)
    .reduce(minReducer, Infinity);

  return smallestDirectorySize;
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  setDebug(type === "example");

  const root = parseInput(content);
  logDebug("parsed", { root });

  calculateDirectoriesSize(root);
  logDebug("with sizes", { root });

  switch (star) {
    case "first":
      return getSumDirectories({ threshold: 100_000, root });
    case "second":
      return getFolderToFreeSpace(root);
  }
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 7, type: "test" });
  console.log({ result });
})();
