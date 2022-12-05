/**
 * @source https://www.geeksforgeeks.org/javascript-program-to-inplace-rotate-square-matrix-by-90-degrees-set-1/
 */
export function rotateMatrix(matrix: unknown[][], N: number) {
  const shadowMatrix = [...matrix];

  for (let x = 0; x < N / 2; x++) {
    for (let y = x; y < N - x - 1; y++) {
      const temp = shadowMatrix[x][y];

      shadowMatrix[x][y] = shadowMatrix[y][N - 1 - x];
      shadowMatrix[y][N - 1 - x] = shadowMatrix[N - 1 - x][N - 1 - y];
      shadowMatrix[N - 1 - x][N - 1 - y] = shadowMatrix[N - 1 - y][x];
      shadowMatrix[N - 1 - y][x] = temp;
    }
  }

  return shadowMatrix;
}
