let DEBUG = false;

export function setDebug(status: boolean): void {
  DEBUG = status;
}

export function logDebug(...params: any[]) {
  if (!DEBUG) {
    return;
  }

  console.log(...params);
}
