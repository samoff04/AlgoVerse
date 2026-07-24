export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  starterCode: string;
  functionName: string;
  testInput: number[];
  timeLimitSeconds: number;
  visualizable?: boolean;
}

export const problems: Problem[] = [
  { id: "sort-array", title: "Sort an array", category: "Sorting", difficulty: "Easy", prompt: "Implement a function that sorts an array of numbers in ascending order.", starterCode: "function solve(arr) {\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [8, 3, 6, 1, 9, 4], timeLimitSeconds: 900 },
  { id: "find-max", title: "Find the maximum value", category: "Arrays", difficulty: "Easy", prompt: "Return the largest number in an array without using built-in max functions.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [4, 9, 2, 15, 6, 3], timeLimitSeconds: 300 },
  { id: "find-min", title: "Find the minimum value", category: "Arrays", difficulty: "Easy", prompt: "Return the smallest number in an array.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [4, 9, 2, 15, 6, 3], timeLimitSeconds: 300 },
  { id: "second-largest", title: "Second largest element", category: "Arrays", difficulty: "Easy", prompt: "Return the second largest distinct value in an array.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [4, 9, 2, 15, 6, 15, 3], timeLimitSeconds: 420 },
  { id: "reverse-array", title: "Reverse an array in place", category: "Arrays", difficulty: "Easy", prompt: "Reverse the array without using the built-in reverse method.", starterCode: "function solve(arr) {\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [1, 2, 3, 4, 5], timeLimitSeconds: 300 },
  { id: "remove-duplicates", title: "Remove duplicates", category: "Arrays", difficulty: "Easy", prompt: "Return a new array with duplicate values removed, preserving order.", starterCode: "function solve(arr) {\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [1, 2, 2, 3, 4, 4, 4, 5], timeLimitSeconds: 420 },
  { id: "two-sum", title: "Two sum", category: "Hashing", difficulty: "Easy", prompt: "Given an array and a target sum of 10, return the indices of two numbers that add up to it.", starterCode: "function solve(arr) {\n  const target = 10;\n  // your code here\n  return [];\n}", functionName: "solve", testInput: [2, 7, 4, 6, 3], timeLimitSeconds: 600 },
  { id: "move-zeroes", title: "Move zeroes to the end", category: "Two pointers", difficulty: "Easy", prompt: "Move all zeroes to the end while keeping the relative order of non-zero elements, in place.", starterCode: "function solve(arr) {\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [0, 1, 0, 3, 12, 0, 5], timeLimitSeconds: 480 },
  { id: "max-subarray-sum", title: "Maximum subarray sum", category: "Dynamic programming", difficulty: "Medium", prompt: "Find the contiguous subarray with the largest sum and return that sum (Kadane's algorithm).", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [-2, 1, -3, 4, -1, 2, 1, -5, 4], timeLimitSeconds: 600 },
  { id: "binary-search", title: "Binary search", category: "Searching", difficulty: "Easy", prompt: "Given a sorted array, return the index of a target value 9, or -1 if not found.", starterCode: "function solve(arr) {\n  const target = 9;\n  // your code here\n  return -1;\n}", functionName: "solve", testInput: [1, 3, 5, 7, 9, 11, 13], timeLimitSeconds: 480 },
  { id: "peak-element", title: "Find a peak element", category: "Searching", difficulty: "Medium", prompt: "Return the index of any element that is greater than both its neighbors.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [1, 3, 20, 4, 1, 0], timeLimitSeconds: 600 },
  { id: "majority-element", title: "Majority element", category: "Hashing", difficulty: "Medium", prompt: "Return the element that appears more than n/2 times in the array.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [2, 2, 1, 1, 1, 2, 2], timeLimitSeconds: 600 },
  { id: "merge-sorted", title: "Merge two sorted arrays", category: "Two pointers", difficulty: "Medium", prompt: "Merge this array with [2, 6, 10, 14] (already sorted) into one sorted array.", starterCode: "function solve(arr) {\n  const other = [2, 6, 10, 14];\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [1, 5, 9, 13], timeLimitSeconds: 600 },
  { id: "trapping-rain", title: "Trapping rain water", category: "Two pointers", difficulty: "Hard", prompt: "Given elevation heights, compute how much rainwater can be trapped between the bars.", starterCode: "function solve(arr) {\n  // your code here\n  return 0;\n}", functionName: "solve", testInput: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], timeLimitSeconds: 900 },
  { id: "product-except-self", title: "Product of array except self", category: "Arrays", difficulty: "Hard", prompt: "Return an array where each element is the product of all other elements, without using division.", starterCode: "function solve(arr) {\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [1, 2, 3, 4], timeLimitSeconds: 900 },
  { id: "rotate-array", title: "Rotate array by k", category: "Arrays", difficulty: "Medium", prompt: "Rotate the array to the right by 2 positions, in place.", starterCode: "function solve(arr) {\n  const k = 2;\n  // your code here\n  return arr;\n}", functionName: "solve", testInput: [1, 2, 3, 4, 5, 6, 7], timeLimitSeconds: 600 },

  { id: "reverse-linked-list", title: "Reverse a linked list", category: "Linked Lists", difficulty: "Medium", prompt: "Given the head of a singly linked list, reverse it in place and return the new head.", starterCode: "function reverseList(head) {\n  // your code here\n}", functionName: "reverseList", testInput: [], timeLimitSeconds: 900, visualizable: false },
  { id: "detect-cycle", title: "Detect a cycle in a linked list", category: "Linked Lists", difficulty: "Medium", prompt: "Determine if a linked list has a cycle, using O(1) extra space (Floyd's algorithm).", starterCode: "function hasCycle(head) {\n  // your code here\n}", functionName: "hasCycle", testInput: [], timeLimitSeconds: 900, visualizable: false },
  { id: "valid-parentheses", title: "Valid parentheses", category: "Stacks", difficulty: "Easy", prompt: "Given a string of brackets, determine if it is valid using a stack.", starterCode: "function isValid(s) {\n  // your code here\n}", functionName: "isValid", testInput: [], timeLimitSeconds: 600, visualizable: false },
  { id: "min-stack", title: "Design a min stack", category: "Stacks", difficulty: "Medium", prompt: "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).", starterCode: "class MinStack {\n  // your code here\n}", functionName: "MinStack", testInput: [], timeLimitSeconds: 900, visualizable: false },
  { id: "invert-tree", title: "Invert a binary tree", category: "Trees", difficulty: "Easy", prompt: "Given the root of a binary tree, invert it and return the root.", starterCode: "function invertTree(root) {\n  // your code here\n}", functionName: "invertTree", testInput: [], timeLimitSeconds: 600, visualizable: false },
  { id: "lca-bst", title: "Lowest common ancestor in a BST", category: "Trees", difficulty: "Medium", prompt: "Given a BST and two node values, find their lowest common ancestor.", starterCode: "function lowestCommonAncestor(root, p, q) {\n  // your code here\n}", functionName: "lowestCommonAncestor", testInput: [], timeLimitSeconds: 900, visualizable: false },
  { id: "validate-bst", title: "Validate a binary search tree", category: "Trees", difficulty: "Medium", prompt: "Determine whether a given binary tree is a valid BST.", starterCode: "function isValidBST(root) {\n  // your code here\n}", functionName: "isValidBST", testInput: [], timeLimitSeconds: 900, visualizable: false },
];

export function getProblem(id: string) {
  return problems.find((p) => p.id === id);
}

export const categories = Array.from(new Set(problems.map((p) => p.category)));