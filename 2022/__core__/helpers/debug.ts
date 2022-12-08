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

/**
 * @source https://stackoverflow.com/questions/20018588/how-to-monitor-the-memory-usage-of-node-js#answer-64550489
 */
export const displayMemoryUsage = () => {
  const formatMemoryUsage = (data) =>
    `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

  const memoryData = process.memoryUsage();

  const memoryUsage = {
    /** Resident Set Size - total memory allocated for the process execution */
    rss: `${formatMemoryUsage(memoryData.rss)}`,
    /** total size of the allocated heap */
    heapTotal: `${formatMemoryUsage(memoryData.heapTotal)}`,
    /** actual memory used during the execution */
    heapUsed: `${formatMemoryUsage(memoryData.heapUsed)}`,
    /** V8 external memory */
    external: `${formatMemoryUsage(memoryData.external)}`,
  };

  console.log(memoryUsage);
};
