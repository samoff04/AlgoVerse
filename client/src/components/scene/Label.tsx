import { useMemo } from "react";
import * as THREE from "three";

export function Label({ text, position, fontSize = 32, color = "#ffffff" }: { text: string; position: [number, number, number]; fontSize?: number; color?: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text, fontSize, color]);

  return <sprite position={position} scale={[1.2, 0.6, 1]}><spriteMaterial map={texture} transparent depthWrite={false} /></sprite>;
}