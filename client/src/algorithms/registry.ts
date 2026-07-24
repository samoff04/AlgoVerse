import { generateBubbleSort, bubbleSortSource } from "../engine-core/algorithms/bubbleSort";
import { generateSelectionSort, selectionSortSource } from "../engine-core/algorithms/selectionSort";
import { generateInsertionSort, insertionSortSource } from "../engine-core/algorithms/insertionSort";
import { generateQuickSort, quickSortSource } from "../engine-core/algorithms/quickSort";
import { generateMergeSort, mergeSortSource } from "../engine-core/algorithms/mergeSort";
import type { ArrayRun } from "../engine-core/types/events";

export interface AlgorithmDef {
  slug: string;
  title: string;
  category: string;
  generate: (input: number[]) => ArrayRun;
  source: string;
  defaultInput: number[];
}

export const algorithmRegistry: AlgorithmDef[] = [
  { slug: "bubble-sort", title: "Bubble sort", category: "Sorting", generate: generateBubbleSort, source: bubbleSortSource, defaultInput: [8, 3, 6, 1, 9, 4] },
  { slug: "selection-sort", title: "Selection sort", category: "Sorting", generate: generateSelectionSort, source: selectionSortSource, defaultInput: [8, 3, 6, 1, 9, 4] },
  { slug: "insertion-sort", title: "Insertion sort", category: "Sorting", generate: generateInsertionSort, source: insertionSortSource, defaultInput: [8, 3, 6, 1, 9, 4] },
  { slug: "quick-sort", title: "Quick sort", category: "Sorting", generate: generateQuickSort, source: quickSortSource, defaultInput: [8, 3, 6, 1, 9, 4] },
  { slug: "merge-sort", title: "Merge sort", category: "Sorting", generate: generateMergeSort, source: mergeSortSource, defaultInput: [8, 3, 6, 1, 9, 4] },
];

export function getAlgorithm(slug: string) {
  return algorithmRegistry.find((a) => a.slug === slug);
}