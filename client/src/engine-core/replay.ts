import type { ArrayRun } from "./types/events";

export interface ArraySceneState {
  array: number[];
  comparing: [number, number] | null;
  sorted: Set<number>;
  activeLine: number | null;
}

export function computeArrayStateAtStep(
  run: ArrayRun,
  step: number
): ArraySceneState {
  const array = [
    ...run.initialArray,
  ];

  const sorted = new Set<number>();

  let comparing:
    | [number, number]
    | null = null;

  let activeLine:
    | number
    | null = null;

  for (
    let i = 0;
    i <= step &&
    i < run.events.length;
    i++
  ) {
    const event = run.events[i];

    activeLine =
      run.codeLineMap[i] ??
      activeLine;

    if (event.type === "compare") {
      comparing = event.indices;
    }

    if (event.type === "swap") {
      const [a, b] =
        event.indices;

      [
        array[a],
        array[b],
      ] = [
        array[b],
        array[a],
      ];
    }

    if (event.type === "set") {
      array[event.index] =
        event.value;
    }

    if (event.type === "sorted") {
      sorted.add(event.index);
    }
  }

  return {
    array,
    comparing,
    sorted,
    activeLine,
  };
}

export function computeStats(
  run: ArrayRun,
  step: number
) {
  let comparisons = 0;
  let swaps = 0;

  for (
    let i = 0;
    i <= step &&
    i < run.events.length;
    i++
  ) {
    const event =
      run.events[i];

    if (
      event.type === "compare"
    ) {
      comparisons++;
    }

    if (
      event.type === "swap" ||
      event.type === "set"
    ) {
      swaps++;
    }
  }

  return {
    comparisons,
    swaps,
  };
}

export interface VisualElement {
  id: number;
  index: number;
  value: number;
}

export interface VisualState {
  elements: VisualElement[];
  comparing:
    | [number, number]
    | null;
  sorted: Set<number>;
  activeLine: number | null;
}

export function computeVisualState(
  run: ArrayRun,
  step: number
): VisualState {
  const n =
    run.initialArray.length;

  /*
   * Every original array value receives
   * a stable identity.
   *
   * Example:
   *
   * [8, 3, 6, 1]
   *
   * IDs:
   * [0, 1, 2, 3]
   */
  const ids = Array.from(
    { length: n },
    (_, index) => index
  );

  const values = [
    ...run.initialArray,
  ];

  const sorted =
    new Set<number>();

  let comparing:
    | [number, number]
    | null = null;

  let activeLine:
    | number
    | null = null;

  for (
    let i = 0;
    i <= step &&
    i < run.events.length;
    i++
  ) {
    const event =
      run.events[i];

    activeLine =
      run.codeLineMap[i] ??
      activeLine;

    if (
      event.type === "compare"
    ) {
      comparing =
        event.indices;
    }

    if (
      event.type === "swap"
    ) {
      const [a, b] =
        event.indices;

      /*
       * Move the actual visual identities.
       */
      [
        ids[a],
        ids[b],
      ] = [
        ids[b],
        ids[a],
      ];

      /*
       * Move their values as well.
       */
      [
        values[a],
        values[b],
      ] = [
        values[b],
        values[a],
      ];
    }

    if (
      event.type === "set"
    ) {
      values[event.index] =
        event.value;
    }

    if (
      event.type === "sorted"
    ) {
      sorted.add(
        event.index
      );
    }
  }

  const elements =
    ids.map(
      (id, index) => ({
        id,
        index,
        value: values[index],
      })
    );

  return {
    elements,
    comparing,
    sorted,
    activeLine,
  };
}