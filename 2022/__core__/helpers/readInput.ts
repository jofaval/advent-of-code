import { MainProps } from "../types";

const fs = require("fs");

type GetReadingPathProps = MainProps;

const ROOT_FROM_DIST = ["..", "..", ".."];

function getReadingPath({
  day,
  type,
  separator = "/",
}: ReadInputProps & { separator?: string }): string {
  let filename = "";

  switch (type) {
    case "example":
      filename = "example-input";
      break;
    case "test":
      filename = "input";
      break;
  }

  filename += ".txt";

  return [
    __dirname,
    ...ROOT_FROM_DIST,
    `day-${day.toString().padStart(2, "0")}`,
    "first", // hardcoded, first and second stars will use the same data
    filename,
  ]
    .join(separator)
    .replace(/[\\\/]/g, separator);
}

function sanitizeData(data: string): string {
  let sanitized = data;

  // force standarize the jump line formatting
  sanitized = sanitized.replaceAll("\r", "");
  // removes the last jumpline
  sanitized = sanitized.trimEnd();

  return sanitized;
}

type ReadInputProps = GetReadingPathProps & {
  encoding?: "utf8";
};

export function readInput({
  encoding = "utf8",
  ...readingPathProps
}: ReadInputProps): string {
  const readingPath = getReadingPath(readingPathProps);
  let data = "";

  try {
    const content = fs.readFileSync(readingPath, "utf8");
    const sanitizedData = sanitizeData(content);

    data = sanitizedData;
  } catch (_) {
    return "";
  }

  if (data.trim().length === 0) {
    throw new Error(
      `Careful there! ${readingPath} was found without any content at all!`
    );
  }

  return data;
}
