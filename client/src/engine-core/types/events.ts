export type ArrayEvent =
  | {
      type: "compare";
      indices: [number, number];
      t: number;
    }
  | {
      type: "swap";
      indices: [number, number];
      t: number;
    }
  | {
      type: "set";
      index: number;
      value: number;
      t: number;
    }
  | {
      type: "sorted";
      index: number;
      t: number;
    };

export interface ArrayRun {
  initialArray: number[];
  events: ArrayEvent[];
  codeLineMap: Record<
    number,
    number
  >;
}