import type { ArrayEvent } from "../engine-core/types/events";

export function createTrackedArray(initial: number[]) {
  const events: ArrayEvent[] = [];
  let t = 0;

  let lastRead: number | null = null;

  const arr = [...initial];

  /*
   * Tracks the first half of a normal JavaScript swap:
   *
   * const temp = arr[j];
   * arr[j] = arr[j + 1];
   * arr[j + 1] = temp;
   *
   * When:
   *
   * arr[j] = arr[j + 1]
   *
   * happens, we remember that the value at j is being replaced
   * by the value at j + 1.
   */
  let pendingSwap: {
    from: number;
    to: number;
  } | null = null;

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
            indices: [lastRead, index],
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

    set(target, prop, value, receiver) {
      const index = Number(prop);

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < target.length
      ) {
        const oldValue = target[index];

        if (oldValue !== value) {
          /*
           * Detect the first assignment of a standard swap:
           *
           * arr[j] = arr[j + 1]
           *
           * At this moment, the value currently at `index`
           * is being replaced by a value read from another index.
           *
           * The previous read is usually the source index.
           */
          if (
            lastRead !== null &&
            lastRead !== index &&
            target[lastRead] === value
          ) {
            pendingSwap = {
              from: index,
              to: lastRead,
            };
          }

          /*
           * Detect the second assignment:
           *
           * arr[j + 1] = temp
           *
           * Once the original value is written back,
           * we have a complete swap.
           */
          if (
            pendingSwap &&
            index === pendingSwap.to &&
            value === oldValue
          ) {
            events.push({
              type: "swap",
              indices: [
                pendingSwap.from,
                pendingSwap.to,
              ],
              t: t++,
            });

            pendingSwap = null;
          }
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