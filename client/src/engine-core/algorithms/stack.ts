export type StackEvent = { type: "push"; value: number; t: number } | { type: "pop"; t: number };

export function generateStackDemo(): { events: StackEvent[] } {
  const events: StackEvent[] = [];
  let t = 0;
  [4, 17, 9, 25].forEach((v) => events.push({ type: "push", value: v, t: t++ }));
  events.push({ type: "pop", t: t++ });
  events.push({ type: "push", value: 33, t: t++ });
  return { events };
}

export function computeStackStateAtStep(events: StackEvent[], step: number) {
  const stack: { id: number; value: number }[] = [];
  let nextId = 0;
  let lastOp: "push" | "pop" | null = null;

  for (let i = 0; i <= step && i < events.length; i++) {
    const e = events[i];
    if (e.type === "push") stack.push({ id: nextId++, value: e.value });
    if (e.type === "pop") stack.pop();
    lastOp = e.type;
  }
  return { stack, lastOp };
}