export type AdventOfCodeStar = "first" | "second";

export type MainProps = {
  day: number;
  star: AdventOfCodeStar;
  type: "example" | "test";
};
