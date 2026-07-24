import type { ArrayEvent, ArrayRun } from "../types/events";

export function generateMergeSort(input: number[]): ArrayRun {
  const arr = [...input];
  const events: ArrayEvent[] = [];
  const codeLineMap: Record<number, number> = {};

  let t = 0;

  function pushCompare(i: number, j: number) {
    events.push({
      type: "compare",
      indices: [i, j],
      t,
    });

    codeLineMap[t] = 15;
    t++;
  }

  function pushSwap(i: number, j: number) {
    if (i === j) return;

    [arr[i], arr[j]] = [arr[j], arr[i]];

    events.push({
      type: "swap",
      indices: [i, j],
      t,
    });

    codeLineMap[t] = 16;
    t++;
  }

  function merge(lo: number, mid: number, hi: number) {
    let start = lo;
    let midPointer = mid + 1;

    while (
      start <= mid &&
      midPointer <= hi
    ) {
      pushCompare(start, midPointer);

      if (arr[start] <= arr[midPointer]) {
        start++;
        continue;
      }

      /*
       * The element from the right half is smaller.
       *
       * Move it left one position at a time.
       *
       * Example:
       *
       * [3, 8, 1, 6]
       *        ↑
       *
       * becomes:
       *
       * [3, 1, 8, 6]
       *
       * then:
       *
       * [1, 3, 8, 6]
       *
       * Each adjacent swap changes element indices,
       * allowing ArrayScene to animate the movement.
       */

      let index = midPointer;

      while (index > start) {
        pushSwap(index, index - 1);
        index--;
      }

      start++;
      mid++;
      midPointer++;
    }
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      return;
    }

    const mid = Math.floor((lo + hi) / 2);

    codeLineMap[t] = 3;
    t++;

    sort(lo, mid);
    sort(mid + 1, hi);

    merge(lo, mid, hi);
  }

  if (arr.length > 1) {
    sort(0, arr.length - 1);
  }

  for (let i = 0; i < arr.length; i++) {
    events.push({
      type: "sorted",
      index: i,
      t,
    });

    codeLineMap[t] = 7;
    t++;
  }

  return {
    initialArray: input,
    events,
    codeLineMap,
  };
}

export const mergeSortSource = `function mergeSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;

  const mid = Math.floor((lo + hi) / 2);

  mergeSort(arr, lo, mid);
  mergeSort(arr, mid + 1, hi);

  merge(arr, lo, mid, hi);

  return arr;
}

function merge(arr, lo, mid, hi) {
  let start = lo;
  let right = mid + 1;

  while (start <= mid && right <= hi) {
    if (arr[start] <= arr[right]) {
      start++;
      continue;
    }

    let index = right;

    while (index > start) {
      [arr[index], arr[index - 1]] =
        [arr[index - 1], arr[index]];

      index--;
    }

    start++;
    mid++;
    right++;
  }
}`;