import {
  createTrackedArray,
} from "./createTrackedArray";

import type {
  ArrayRun,
} from "../engine-core/types/events";

export function runUserCode(
  code: string,
  functionName: string,
  initialArray: number[]
): ArrayRun & {
  success: boolean;
  error?: string;
} {
  const {
    proxy,
    events,
  } =
    createTrackedArray(
      initialArray
    );

  try {
    const factory =
      new Function(`
        "use strict";
        ${code}
        return ${functionName};
      `);

    const fn =
      factory();

    if (
      typeof fn !==
      "function"
    ) {
      throw new Error(
        `${functionName} is not a function`
      );
    }

    fn(proxy);

    return {
      success: true,
      initialArray,
      events,
      codeLineMap: {},
    };
  } catch (error) {
    return {
      success: false,
      initialArray,
      events,
      codeLineMap: {},
      error:
        error instanceof Error
          ? error.message
          : "Unknown execution error",
    };
  }
}