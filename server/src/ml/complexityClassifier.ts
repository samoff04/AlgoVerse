import * as acorn from "acorn";
import * as tf from "@tensorflow/tfjs";

interface CodeFeatures { maxLoopDepth: number; loopCount: number; hasRecursion: boolean; branchCount: number }

export function extractFeatures(code: string, functionName: string): CodeFeatures {
  const ast = acorn.parse(code, { ecmaVersion: 2022 });
  let maxLoopDepth = 0, loopCount = 0, branchCount = 0, hasRecursion = false;

  function walk(node: any, depth: number) {
    if (!node || typeof node !== "object") return;
    if (["ForStatement", "WhileStatement", "ForOfStatement"].includes(node.type)) {
      loopCount++; depth++; maxLoopDepth = Math.max(maxLoopDepth, depth);
    }
    if (node.type === "IfStatement") branchCount++;
    if (node.type === "CallExpression" && node.callee?.name === functionName) hasRecursion = true;
    for (const key in node) {
      const child = node[key];
      if (Array.isArray(child)) child.forEach((c) => walk(c, depth));
      else if (child && typeof child.type === "string") walk(child, depth);
    }
  }
  walk(ast, 0);
  return { maxLoopDepth, loopCount, hasRecursion, branchCount };
}

export async function predictComplexity(features: CodeFeatures): Promise<string> {
  const input = tf.tensor2d([[features.maxLoopDepth, features.loopCount, features.hasRecursion ? 1 : 0, features.branchCount]]);
  const weights = tf.tensor2d([[0.1, 0.6, 0.1, 0.05], [0.6, 0.3, 0.1, 0.05], [0.05, 0.05, 0.85, 0.05], [0.8, 0.1, 0.05, 0.05]]).transpose();
  const logits = input.matMul(weights);
  const probs = tf.softmax(logits);
  const data = await probs.data();
  const labels = ["O(n)", "O(n²)", "O(2ⁿ)", "O(nᵏ)"];
  const predicted = labels[data.indexOf(Math.max(...Array.from(data)))];
  input.dispose(); weights.dispose(); logits.dispose(); probs.dispose();
  return predicted;
}