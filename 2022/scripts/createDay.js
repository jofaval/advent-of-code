const ENCODING = "utf8";

/**
 * @returns {{
 *   day: string
 * }}
 */
function parseParams() {
  const params = {};

  const rawParams = process.argv.slice(2);
  if (rawParams.length !== 1) {
    throw new Error(
      "One param is required for this script, the day, a positive int"
    );
  }

  const parsedDay = parseInt(rawParams[0]);
  if (isNaN(parsedDay)) {
    throw new Error("The day must be a positive int");
  }

  params.day = parsedDay.toString().padStart(2, "0");

  return params;
}

/**
 * @param {string} filename
 * @param {number} day
 * @returns {void}
 */
function replaceDay(filename, day, candidate = /§DAY/g) {
  const fs = require("fs");

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

/**
 * @param {string} origin
 * @param {string} destination
 * @param {string} paddedDay
 * @returns {void}
 */
function copyDirectory(origin, destination, paddedDay) {
  const fse = require("fs-extra");

  const day = parseInt(paddedDay);

  try {
    fse.copySync(origin, destination, { overwrite: true | false });

    replaceDay(`${destination}/main.ts`, day);
    replaceDay(`${destination}/run.sh`, paddedDay);

    replaceDay(
      `./README.md`,
      [`1. [Day ${day}](./day-${paddedDay}/)`, "<!-- Next day -->"].join("\n"),
      "<!-- Next day -->"
    );

    console.log("File generated at:", destination);
    console.log("cd", destination);
  } catch (err) {
    console.error(err);
  }
}

/**
 * @returns {void}
 */
function entry() {
  console.log("Executing script...");
  console.log();

  const { day: paddedDay } = parseParams();

  const origin = "./__core__/__template__";
  const destination = `./day-${paddedDay}`;

  copyDirectory(origin, destination, paddedDay);
}

(() => {
  entry();
})();
