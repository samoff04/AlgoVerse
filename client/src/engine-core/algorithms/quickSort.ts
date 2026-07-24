import type { ArrayEvent, ArrayRun } from "../types/events";

export function generateQuickSort(
  input: number[]
): ArrayRun {
  const arr = [...input];
  const events: ArrayEvent[] = [];
  const codeLineMap: Record<number, number> = {};

  let t = 0;

  function partition(
    low: number,
    high: number
  ) {
    const pivot = arr[high];
    let i = low - 1;

    codeLineMap[t] = 3;
    t++;

    for (
      let j = low;
      j < high;
      j++
    ) {
      events.push({
        type: "compare",
        indices: [j, high],
        t,
      });

      codeLineMap[t] = 5;
      t++;

      if (arr[j] < pivot) {
        i++;

        [
          arr[i],
          arr[j],
        ] = [
          arr[j],
          arr[i],
        ];

        events.push({
          type: "swap",
          indices: [i, j],
          t,
        });

        codeLineMap[t] = 6;
        t++;
      }
    }

    [
      arr[i + 1],
      arr[high],
    ] = [
      arr[high],
      arr[i + 1],
    ];

    events.push({
      type: "swap",
      indices: [i + 1, high],
      t,
    });

    codeLineMap[t] = 8;
    t++;

    return i + 1;
  }

  function sort(
    low: number,
    high: number
  ) {
    if (low < high) {
      const pi = partition(
        low,
        high
      );

      codeLineMap[t] = 9;
      t++;

      sort(
        low,
        pi - 1
      );

      sort(
        pi + 1,
        high
      );
    } else if (low === high) {
      events.push({
        type: "sorted",
        index: low,
        t,
      });

      codeLineMap[t] = 10;
      t++;
    }
  }

  sort(
    0,
    arr.length - 1
  );

  return {
    initialArray: input,
    events,
    codeLineMap,
  };
}

export const quickSortSource = `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`;