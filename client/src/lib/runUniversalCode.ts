import { TrackedStack, TrackedList, TrackedTree } from "./trackedStructures";

export type StructureType =
  | "array"
  | "stack"
  | "list"
  | "tree";

export interface UniversalSnapshot {
  type: StructureType;
  state: any;
  operation?: string;
  index?: number;
  from?: number;
  to?: number;
  value?: any;
}

export interface UniversalRunResult {
  success: boolean;
  snapshots: UniversalSnapshot[];
  error?: string;
}

export function runUniversalCode(
  code: string,
  functionName: string,
  type: StructureType
): UniversalRunResult {
  let tracked: any;

  switch (type) {
    case "stack":
      tracked = new TrackedStack();
      break;

    case "list":
      tracked = new TrackedList();
      break;

    case "tree":
      tracked = new TrackedTree();
      break;

    case "array":
    default:
      tracked = new TrackedList();
      break;
  }

  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`
      "use strict";
      ${code}
      return ${functionName};
    `);

    const fn = factory();

    if (typeof fn !== "function") {
      throw new Error(
        `${functionName} is not a function`
      );
    }

    /*
     * The user's function receives a tracked data structure.
     *
     * Examples:
     *
     * function demo(stack) {
     *   stack.push(10);
     *   stack.push(20);
     *   stack.pop();
     * }
     *
     * function demo(list) {
     *   list.append(10);
     *   list.append(20);
     * }
     *
     * function demo(tree) {
     *   tree.insert(50);
     *   tree.insert(30);
     *   tree.insert(70);
     * }
     */
    fn(tracked);

    return {
      success: true,
      snapshots: tracked.snapshots ?? [],
    };
  } catch (err: any) {
    return {
      success: false,
      snapshots: tracked?.snapshots ?? [],
      error:
        err instanceof Error
          ? err.message
          : "Unknown execution error",
    };
  }
}