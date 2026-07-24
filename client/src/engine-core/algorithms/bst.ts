export interface TreeNode { id: string; value: number; left: string | null; right: string | null }
export type TreeEvent = { type: "compare"; nodeId: string; t: number } | { type: "insert"; nodeId: string; value: number; t: number };

export function generateBSTDemo(values: number[] = [50, 30, 70, 20, 40, 65, 85]) {
  const nodes: Record<string, TreeNode> = {};
  const events: TreeEvent[] = [];
  let rootId: string | null = null;
  let t = 0;

  function insert(value: number) {
    const id = `n${Object.keys(nodes).length}`;
    if (!rootId) {
      nodes[id] = { id, value, left: null, right: null };
      rootId = id;
      events.push({ type: "insert", nodeId: id, value, t: t++ });
      return;
    }
    let cur = rootId;
    while (true) {
      events.push({ type: "compare", nodeId: cur, t: t++ });
      const node = nodes[cur];
      if (value < node.value) {
        if (!node.left) { nodes[id] = { id, value, left: null, right: null }; node.left = id; events.push({ type: "insert", nodeId: id, value, t: t++ }); return; }
        cur = node.left;
      } else {
        if (!node.right) { nodes[id] = { id, value, left: null, right: null }; node.right = id; events.push({ type: "insert", nodeId: id, value, t: t++ }); return; }
        cur = node.right;
      }
    }
  }
  values.forEach(insert);
  return { events, finalNodes: nodes, rootId };
}