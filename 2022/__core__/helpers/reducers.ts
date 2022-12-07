export const sumReducer = (prev: number, acc: number) => prev + acc;

export const minReducer = (min: number, current: number) => {
  if (min > current) {
    return current;
  }

  return min;
};

export const maxReducer = (max: number, current: number) => {
  if (max < current) {
    return current;
  }

  return max;
};
