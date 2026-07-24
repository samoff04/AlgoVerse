import { useMemo } from "react";
import * as THREE from "three";

export function Edge({ from, to, color = "#4a4a55", width = 1 }: { from: [number, number, number]; to: [number, number, number]; color?: string; width?: number }) {
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]), [from, to]);
  return <line geometry={geometry}><lineBasicMaterial color={color} linewidth={width} /></line>;
}