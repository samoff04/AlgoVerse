import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const initial = [6, 2, 8, 3, 9, 1, 5, 4, 7];

function useAutoBubbleSort(values: number[], intervalMs = 700) {
  const [arr, setArr] = useState(values);
  const stepRef = useRef({ i: 0, j: 0 });

  useState(() => {
    const id = setInterval(() => {
      setArr((prev) => {
        const next = [...prev];
        const { i, j } = stepRef.current;
        if (i >= next.length - 1) {
          stepRef.current = { i: 0, j: 0 };
          return values.slice().sort(() => Math.random() - 0.5);
        }
        if (j >= next.length - i - 1) {
          stepRef.current = { i: i + 1, j: 0 };
          return next;
        }
        if (next[j] > next[j + 1]) [next[j], next[j + 1]] = [next[j + 1], next[j]];
        stepRef.current = { i, j: j + 1 };
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  });

  return arr;
}

function Bars() {
  const arr = useAutoBubbleSort(initial);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {arr.map((val, i) => {
        const x = i * 0.7 - (arr.length * 0.7) / 2 + 0.35;
        const height = val / 3.2;
        return (
          <mesh key={i} position={[x, height / 2 - 1, 0]}>
            <boxGeometry args={[0.5, height, 0.5]} />
            <meshStandardMaterial color="#7F77DD" opacity={0.5} transparent />
          </mesh>
        );
      })}
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]">
      <Canvas camera={{ position: [4, 1, 12], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />
        <pointLight position={[-5, 2, -5]} intensity={0.25} color="#5DCAA5" />
        <Bars />
        <OrbitControls enabled={false} />
      </Canvas>
    </div>
  );
}