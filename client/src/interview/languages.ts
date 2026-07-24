export interface LanguageOption {
  id: string;
  label: string;
  monacoId: string;
  executable: boolean;
  color: string;
}

export const languages: LanguageOption[] = [
  { id: "javascript", label: "JavaScript", monacoId: "javascript", executable: true, color: "#F0DB4F" },
  { id: "typescript", label: "TypeScript", monacoId: "typescript", executable: false, color: "#3178C6" },
  { id: "python", label: "Python", monacoId: "python", executable: false, color: "#4B8BBE" },
  { id: "java", label: "Java", monacoId: "java", executable: false, color: "#E76F00" },
  { id: "cpp", label: "C++", monacoId: "cpp", executable: false, color: "#659AD2" },
  { id: "csharp", label: "C#", monacoId: "csharp", executable: false, color: "#9B4F96" },
  { id: "go", label: "Go", monacoId: "go", executable: false, color: "#00ADD8" },
  { id: "rust", label: "Rust", monacoId: "rust", executable: false, color: "#DEA584" },
];

export function starterTemplate(languageId: string, functionName: string, prompt: string): string {
  const comment = `// ${prompt}`;
  switch (languageId) {
    case "javascript":
      return `function ${functionName}(arr) {\n  // your code here\n  return arr;\n}`;
    case "typescript":
      return `${comment}\nfunction ${functionName}(arr: number[]): number[] {\n  // your code here\n  return arr;\n}`;
    case "python":
      return `# ${prompt}\ndef ${functionName}(arr):\n    # your code here\n    return arr`;
    case "java":
      return `// ${prompt}\nclass Solution {\n    public int[] ${functionName}(int[] arr) {\n        // your code here\n        return arr;\n    }\n}`;
    case "cpp":
      return `// ${prompt}\n#include <vector>\nusing namespace std;\n\nvector<int> ${functionName}(vector<int>& arr) {\n    // your code here\n    return arr;\n}`;
    case "csharp":
      return `// ${prompt}\npublic class Solution {\n    public int[] ${functionName}(int[] arr) {\n        // your code here\n        return arr;\n    }\n}`;
    case "go":
      return `// ${prompt}\nfunc ${functionName}(arr []int) []int {\n\t// your code here\n\treturn arr\n}`;
    case "rust":
      return `// ${prompt}\nfn ${functionName}(arr: Vec<i32>) -> Vec<i32> {\n    // your code here\n    arr\n}`;
    default:
      return `// your code here`;
  }
}