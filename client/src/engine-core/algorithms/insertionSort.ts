import type { ArrayEvent, ArrayRun } from "../types/events";

export function generateInsertionSort(
  input: number[]
): ArrayRun {
  const arr = [...input];
  const events: ArrayEvent[] = [];
  const codeLineMap: Record<number, number> = {};

  let t = 0;

  for (
    let i = 1;
    i < arr.length;
    i++
  ) {
    let j = i;

    while (j > 0) {
      events.push({
        type: "compare",
        indices: [j - 1, j],
        t,
      });

      codeLineMap[t] = 4;
      t++;

      if (arr[j - 1] <= arr[j]) {
        break;
      }

      [arr[j - 1], arr[j]] = [
        arr[j],
        arr[j - 1],
      ];

      events.push({
        type: "swap",
        indices: [j - 1, j],
        t,
      });

      codeLineMap[t] = 5;
      t++;

      j--;
    }
  }

  for (
    let i = 0;
    i < arr.length;
    i++
  ) {
    events.push({
      type: "sorted",
      index: i,
      t,
    });

    codeLineMap[t] = 9;
    t++;
  }

  return {
    initialArray: input,
    events,
    codeLineMap,
  };
}

export const insertionSortSource = `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      j--;
    }
  }
  return arr;
}`;