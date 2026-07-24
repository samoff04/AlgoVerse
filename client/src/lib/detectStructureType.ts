import type { StructureType } from "./runUniversalCode";

// A heuristic suggestion only — genuinely inferring structure type from
// arbitrary code isn't reliable without a full runtime, so this reads as a
// hint the learner can override, not an authoritative classification.
export function detectStructureType(code: string): StructureType {
  const lower = code.toLowerCase();
  if (lower.includes(".insert(") && (lower.includes("tree") || lower.includes(".left") || lower.includes(".right"))) return "tree";
  if (lower.includes("insertathead") || lower.includes("insertattail") || lower.includes("removeat") || lower.includes("listnode")) return "list";
  if ((lower.includes(".push(") || lower.includes(".pop(")) && !lower.includes("[")) return "stack";
  return "array";
}