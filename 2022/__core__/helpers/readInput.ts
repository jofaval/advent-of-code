const fs = require("fs");

type GetReadingPathProps = {
  day: number;
  star: "first" | "second";
  type: "example" | "test";
};

const ROOT_FROM_DIST = ["..", "..", ".."];

function getReadingPath({
  day,
  star,
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

  return [__dirname, ...ROOT_FROM_DIST, `day-${day}`, star, filename]
    .join(separator)
    .replace(/[\\\/]/g, separator);
}

function sanitizeData(data: string): string {
  let sanitized = data;

  // force standarize the jump line formatting
  sanitized = sanitized.replaceAll("\r", "");

  return sanitized;
}

export type ReadInputProps = GetReadingPathProps & {
  encoding?: "utf8";
};

export function readInput({
  encoding = "utf8",
  ...readingPathProps
}: ReadInputProps): string {
  const readingPath = getReadingPath(readingPathProps);

  try {
    const data = fs.readFileSync(readingPath, "utf8");
    return sanitizeData(data);
  } catch (_) {
    return "";
  }
}
