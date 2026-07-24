import type { TreeNode } from "../engine-core/algorithms/bst";

export interface StackSnapshot {
  stack: { id: number; value: number }[];
}

export class TrackedStack {
  private arr: { id: number; value: number }[] = [];
  private nextId = 0;
  snapshots: StackSnapshot[] = [];

  constructor() {
    this.snapshot();
  }

  push(value: number) {
    this.arr.push({ id: this.nextId++, value });
    this.snapshot();
    return this.arr.length;
  }
  pop() {
    const v = this.arr.pop();
    this.snapshot();
    return v?.value;
  }
  peek() {
    return this.arr[this.arr.length - 1]?.value;
  }
  get length() {
    return this.arr.length;
  }
  private snapshot() {
    this.snapshots.push({ stack: this.arr.map((n) => ({ ...n })) });
  }
}

export interface ListSnapshot {
  nodes: { id: number; value: number }[];
  traversing: number | null;
}

export class TrackedList {
  private arr: { id: number; value: number }[] = [];
  private nextId = 0;
  snapshots: ListSnapshot[] = [];

  constructor() {
    this.snapshot(null);
  }

  insertAtTail(value: number) {
    this.arr.push({ id: this.nextId++, value });
    this.snapshot(this.arr.length - 1);
  }
  insertAtHead(value: number) {
    this.arr.unshift({ id: this.nextId++, value });
    this.snapshot(0);
  }
  insertAt(index: number, value: number) {
    this.arr.splice(index, 0, { id: this.nextId++, value });
    this.snapshot(index);
  }
  removeAt(index: number) {
    this.arr.splice(index, 1);
    this.snapshot(null);
  }
  traverse(index: number) {
    this.snapshot(index);
  }
  get length() {
    return this.arr.length;
  }
  toArray() {
    return this.arr.map((n) => n.value);
  }
  private snapshot(traversing: number | null) {
    this.snapshots.push({ nodes: this.arr.map((n) => ({ ...n })), traversing });
  }
}

export interface TreeSnapshot {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
  activeNodeId: string | null;
}

export class TrackedTree {
  private nodes: Record<string, TreeNode> = {};
  private rootId: string | null = null;
  snapshots: TreeSnapshot[] = [];

  constructor() {
    this.snapshot(null);
  }

  insert(value: number) {
    const id = `n${Object.keys(this.nodes).length}`;
    if (!this.rootId) {
      this.nodes[id] = { id, value, left: null, right: null };
      this.rootId = id;
      this.snapshot(id);
      return;
    }
    let cur = this.rootId;
    while (true) {
      this.snapshot(cur);
      const node = this.nodes[cur];
      if (value < node.value) {
        if (!node.left) {
          this.nodes[id] = { id, value, left: null, right: null };
          node.left = id;
          this.snapshot(id);
          return;
        }
        cur = node.left;
      } else {
        if (!node.right) {
          this.nodes[id] = { id, value, left: null, right: null };
          node.right = id;
          this.snapshot(id);
          return;
        }
        cur = node.right;
      }
    }
  }
  private snapshot(activeNodeId: string | null) {
    const cloned: Record<string, TreeNode> = {};
    for (const k in this.nodes) cloned[k] = { ...this.nodes[k] };
    this.snapshots.push({ nodes: cloned, rootId: this.rootId, activeNodeId });
  }
}