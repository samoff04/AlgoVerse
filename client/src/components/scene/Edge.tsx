import { useMemo } from "react";
import * as THREE from "three";

export function Edge({
  from,
  to,
  color = "#4a4a55",
  width = 1,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
  width?: number;
}) {
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ]);

    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: width,
    });

    return new THREE.Line(geometry, material);
  }, [from, to, color, width]);

  return <primitive object={line} />;
}