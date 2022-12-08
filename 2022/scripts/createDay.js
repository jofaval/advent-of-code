const ENCODING = "utf8";

const day = process.argv.at(-1);

if (isNaN(day)) return -1;

const paddedDay = day.padStart(2, "0");

const fse = require("fs-extra");
const fs = require("fs");

const SRC_DIR = "./__core__/__template__";
const DEST_DIR = `./day-${paddedDay}`;

/**
 * @param {string} filename
 * @param {number} day
 * @returns {void}
 */
function replaceDay(filename, day, candidate = /§DAY/g) {
  try {
    const fileData = fs.readFileSync(filename, ENCODING);
    const result = fileData.replace(candidate, day);

    fs.writeFile(filename, result, ENCODING, function (err) {
      if (err) return console.log(err);
    });
  } catch (error) {
    return console.log(err);
  }
}

try {
  fse.copySync(SRC_DIR, DEST_DIR, { overwrite: true | false });

  replaceDay(`${DEST_DIR}/main.ts`, day);
  replaceDay(`${DEST_DIR}/run.sh`, paddedDay);
  replaceDay(
    `./README.md`,
    [`1. [Day ${day}](./day-${paddedDay}/)`, "<!-- Next day -->"].join("\n"),
    "<!-- Next day -->"
  );

  console.log("File generated at:", DEST_DIR);
  console.log("cd", DEST_DIR);
} catch (err) {
  console.error(err);
}
