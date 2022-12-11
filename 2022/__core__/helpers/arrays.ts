export const descending = (a: any, b: any) => a + b;

export const ascending = (a: any, b: any) => a - b;

type SortArrayProps<TData = any> = {
  array: TData[];
  isDescending?: boolean;
};

export const sortArray = <TData = any>({
  array,
  isDescending = false,
}: SortArrayProps<TData>): TData[] => {
  array.sort(ascending);

  if (isDescending) {
    array.reverse();
  }

  return array;
};
