import type { ArrayEvent, ArrayRun } from "../types/events";

export function generateSelectionSort(
  input: number[]
): ArrayRun {
  const arr = [...input];
  const events: ArrayEvent[] = [];
  const codeLineMap: Record<number, number> = {};

  let t = 0;

  for (
    let i = 0;
    i < arr.length - 1;
    i++
  ) {
    let minIdx = i;

    for (
      let j = i + 1;
      j < arr.length;
      j++
    ) {
      events.push({
        type: "compare",
        indices: [minIdx, j],
        t,
      });

      codeLineMap[t] = 5;
      t++;

      if (
        arr[j] < arr[minIdx]
      ) {
        minIdx = j;

        codeLineMap[t] = 5;
        t++;
      }
    }

    if (minIdx !== i) {
      [
        arr[i],
        arr[minIdx],
      ] = [
        arr[minIdx],
        arr[i],
      ];

      events.push({
        type: "swap",
        indices: [i, minIdx],
        t,
      });

      codeLineMap[t] = 7;
      t++;
    }

    events.push({
      type: "sorted",
      index: i,
      t,
    });

    codeLineMap[t] = 8;
    t++;
  }

  events.push({
    type: "sorted",
    index: arr.length - 1,
    t,
  });

  codeLineMap[t] = 8;
  t++;

  return {
    initialArray: input,
    events,
    codeLineMap,
  };
}

export const selectionSortSource = `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`;