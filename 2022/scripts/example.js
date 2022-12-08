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
 * @param {string} command
 * @returns {void}
 */
function executeCommand(command) {
  const { exec } = require("child_process");

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }

    console.log(stdout);
  });
}

/**
 * @param {string} day
 * @returns {string}
 */
function generateRunDayCommand(day) {
  return `node ./dist/day-${day}/main.js`;
}

/**
 * @returns {void}
 */
function entry() {
  console.log("Executing script...");
  console.log();

  const params = parseParams();
  const command = generateRunDayCommand(params.day);

  executeCommand(command);
}

(() => {
  entry();
})();
