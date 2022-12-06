import { MainProps, readInput } from "../__core__";

type Marker = string[];

type Signal = string[];

type Input = Signal;

function parseInput(content: string): Input {
  return content.split("");
}

/**
 * Should check if there are no repeated values
 */
function isMarkerValid(marker: Marker): boolean {
  return marker.length === new Set(marker).size;
}

function findMarker(signal: Signal, extensiveLookUp: boolean = false): number {
  let marker = [];

  let minSize = 4;
  if (extensiveLookUp) {
    minSize = 14;
  }

  const signalLen = signal.length;
  for (let position = 0; position < signalLen; position++) {
    marker.push(signal[position]);

    if (marker.length >= minSize) {
      if (isMarkerValid(marker)) {
        return position + 1;
      }

      marker.shift();
    }
  }

  return -1;
}

function main({ star, day, type }: MainProps) {
  const content = readInput({ star, day, type });
  const parsed = parseInput(content);

  const firstMarkerPosition = findMarker(parsed, star === "second");

  return firstMarkerPosition;
}

// entrypoint
(() => {
  const result = main({ star: "second", day: 6, type: "test" });
  console.log({ result });
})();
