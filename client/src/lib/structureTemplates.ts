import type { StructureType } from "./runUniversalCode";

export type Language =
  | "javascript"
  | "python"
  | "java"
  | "cpp";

export const languageMeta = {
  javascript: {
    label: "JavaScript",
    extension: "js",
  },

  python: {
    label: "Python",
    extension: "py",
  },

  java: {
    label: "Java",
    extension: "java",
  },

  cpp: {
    label: "C++",
    extension: "cpp",
  },
} as const;

export type StructureTemplate = {
  code: Record<Language, string>;
  functionName: string;
  label: string;
  hint: string;
};

export const structureTemplates: Record<
  StructureType,
  StructureTemplate
> = {
  array: {
    label: "Array",
    functionName: "mySort",

    hint:
      "Operates on a plain array — use standard indexing like arr[i].",

    code: {
      javascript: `function mySort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}`,

      python: `def mySort(arr):
    n = len(arr)

    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr`,

      java: `static int[] mySort(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        for (int j = 0;
             j < arr.length - i - 1;
             j++) {

            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}`,

      cpp: `vector<int> mySort(vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        for (int j = 0;
             j < arr.size() - i - 1;
             j++) {

            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }

    return arr;
}`,
    },
  },

  stack: {
    label: "Stack",
    functionName: "processStack",

    hint:
      "Use push and pop operations — every mutation is tracked automatically.",

    code: {
      javascript: `function processStack(stack) {
  [4, 17, 9, 25].forEach((value) => {
    stack.push(value);
  });

  stack.pop();
  stack.push(33);
}`,

      python: `def process_stack(stack):
    for value in [4, 17, 9, 25]:
        stack.push(value)

    stack.pop()
    stack.push(33)`,

      java: `static void processStack(
    Stack<Integer> stack
) {
    stack.push(4);
    stack.push(17);
    stack.push(9);
    stack.push(25);

    stack.pop();
    stack.push(33);
}`,

      cpp: `void processStack(
    stack<int>& st
) {
    st.push(4);
    st.push(17);
    st.push(9);
    st.push(25);

    st.pop();
    st.push(33);
}`,
    },
  },

  list: {
    label: "Linked list",
    functionName: "buildList",

    hint:
      "Insert, remove, and traverse nodes to see pointer relationships evolve.",

    code: {
      javascript: `function buildList(list) {
  [12, 47, 8, 23].forEach((value) => {
    list.insertAtTail(value);
  });

  list.removeAt(2);
  list.insertAtHead(99);
}`,

      python: `def build_list(linked_list):
    for value in [12, 47, 8, 23]:
        linked_list.insert_at_tail(value)

    linked_list.remove_at(2)
    linked_list.insert_at_head(99)`,

      java: `static void buildList(
    LinkedList<Integer> list
) {
    list.addLast(12);
    list.addLast(47);
    list.addLast(8);
    list.addLast(23);

    list.remove(2);
    list.addFirst(99);
}`,

      cpp: `void buildList(
    list<int>& linkedList
) {
    linkedList.push_back(12);
    linkedList.push_back(47);
    linkedList.push_back(8);
    linkedList.push_back(23);

    auto it = linkedList.begin();
    advance(it, 2);
    linkedList.erase(it);

    linkedList.push_front(99);
}`,
    },
  },

  tree: {
    label: "Binary search tree",
    functionName: "buildBST",

    hint:
      "Insert values and watch comparisons guide each node through the tree.",

    code: {
      javascript: `function buildBST(tree) {
  [50, 30, 70, 20, 40, 65, 85].forEach((value) => {
    tree.insert(value);
  });
}`,

      python: `def build_bst(tree):
    for value in [50, 30, 70, 20, 40, 65, 85]:
        tree.insert(value)`,

      java: `static void buildBST(
    BinarySearchTree tree
) {
    int[] values = {
        50, 30, 70, 20,
        40, 65, 85
    };

    for (int value : values) {
        tree.insert(value);
    }
}`,

      cpp: `void buildBST(
    BinarySearchTree& tree
) {
    vector<int> values = {
        50, 30, 70, 20,
        40, 65, 85
    };

    for (int value : values) {
        tree.insert(value);
    }
}`,
    },
  },
};