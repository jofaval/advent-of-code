export type AdventOfCodeStar = "first" | "second";
export type AdventOfCodeType = "example" | "test";

export type MainProps = {
  /**
   * Identify the number of the challenge you're currently working on
   */
  day: number;
  /**
   * Use `first` for the first part of the challenge.\
   * Use `second` for the second part of the challenge
   */
  star: AdventOfCodeStar;
  /**
   * Use `example` for the given input with an explanation.\
   * Use `test` for your real puzzle input that must be generated
   */
  type: AdventOfCodeType;
};
