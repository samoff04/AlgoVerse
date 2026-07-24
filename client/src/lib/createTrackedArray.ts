import type { ArrayEvent } from "../engine-core/types/events";

export function createTrackedArray(
  initial: number[]
) {
  const events: ArrayEvent[] = [];

  let t = 0;

  const arr = [...initial];

  let lastRead: number | null = null;

  const proxy = new Proxy(arr, {
    get(target, prop, receiver) {
      const index = Number(prop);

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < target.length
      ) {
        if (
          lastRead !== null &&
          lastRead !== index
        ) {
          events.push({
            type: "compare",
            indices: [
              lastRead,
              index,
            ],
            t: t++,
          });
        }

        lastRead = index;
      }

      return Reflect.get(
        target,
        prop,
        receiver
      );
    },

    set(
      target,
      prop,
      value,
      receiver
    ) {
      const index = Number(prop);

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < target.length
      ) {
        const numericValue =
          Number(value);

        if (
          target[index] !==
            numericValue &&
          Number.isFinite(
            numericValue
          )
        ) {
          events.push({
            type: "set",
            index,
            value: numericValue,
            t: t++,
          });
        }
      }

      return Reflect.set(
        target,
        prop,
        value,
        receiver
      );
    },
  });

  return {
    proxy,
    events,
  };
}