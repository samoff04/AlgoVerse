import type { ArrayEvent, ArrayRun } from "../types/events";

export function generateBubbleSort(input: number[]): ArrayRun {
  const arr = [...input];
  const events: ArrayEvent[] = [];
  const codeLineMap: Record<number, number> = {};

  let t = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      events.push({
        type: "compare",
        indices: [j, j + 1],
        t,
      });

      codeLineMap[t] = 4;
      t++;

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [
          arr[j + 1],
          arr[j],
        ];

        events.push({
          type: "swap",
          indices: [j, j + 1],
          t,
        });

        codeLineMap[t] = 5;
        t++;
      }
    }

    events.push({
      type: "sorted",
      index: arr.length - i - 1,
      t,
    });

    codeLineMap[t] = 2;
    t++;
  }

  events.push({
    type: "sorted",
    index: 0,
    t,
  });

  codeLineMap[t] = 2;
  t++;

  return {
    initialArray: input,
    events,
    codeLineMap,
  };
}

export const bubbleSortSource = `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;