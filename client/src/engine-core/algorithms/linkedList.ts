export type ListEvent =
  | { type: "insert"; value: number; position: number; t: number }
  | { type: "delete"; position: number; t: number }
  | { type: "traverse"; position: number; t: number };

export function generateLinkedListDemo(): { events: ListEvent[] } {
  const events: ListEvent[] = [];
  let t = 0;
  [12, 47, 8, 23].forEach((v, i) => events.push({ type: "insert", value: v, position: i, t: t++ }));
  for (let i = 0; i < 4; i++) events.push({ type: "traverse", position: i, t: t++ });
  events.push({ type: "delete", position: 2, t: t++ });
  events.push({ type: "insert", value: 99, position: 2, t: t++ });
  return { events };
}

export function computeListStateAtStep(events: ListEvent[], step: number) {
  const nodes: { id: number; value: number }[] = [];
  let nextId = 0;
  let traversing: number | null = null;

  for (let i = 0; i <= step && i < events.length; i++) {
    const e = events[i];
    if (e.type === "insert") nodes.splice(e.position, 0, { id: nextId++, value: e.value });
    if (e.type === "delete") nodes.splice(e.position, 1);
    traversing = e.type === "traverse" ? e.position : null;
  }
  return { nodes, traversing };
}