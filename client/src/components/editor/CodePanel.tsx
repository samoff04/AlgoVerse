import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export function CodePanel({ source, activeLine }: { source: string; activeLine: number | null }) {
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!editorRef.current || activeLine == null) return;
    const editor = editorRef.current;
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: new (window as any).monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: "active-code-line",
          linesDecorationsClassName: "active-code-line-marker",
        },
      },
    ]);
    editor.revealLineInCenter(activeLine);
  }, [activeLine]);

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={source}
      onMount={handleMount}
      options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, smoothScrolling: true }}
      theme="vs-dark"
    />
  );
}