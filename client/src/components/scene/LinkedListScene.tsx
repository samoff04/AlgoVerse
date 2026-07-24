import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_WIDTH = 1.55;
const NODE_HEIGHT = 0.78;
const NODE_GAP = 1.55;

const COLORS = {
  node: "#6259B5",
  nodeTop: "#756BD0",
  pointer: "#3E3782",
  arrow: "#8D84C8",
  active: "#F0925C",
  text: "#FFFFFF",
  null: "#666673",
};

function useLabelTexture(
  text: string,
  color = COLORS.text,
  size = 56,
  width = 220,
  height = 140
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, width, height);

    ctx.font = `700 ${size}px Inter, Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return texture;
  }, [text, color, size, width, height]);
}

/* ---------------------------------- */
/* NODE */
/* ---------------------------------- */

function ListNode({
  index,
  value,
  active,
  total,
}: {
  index: number;
  value: number;
  active: boolean;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const x = index * NODE_GAP - ((total - 1) * NODE_GAP) / 2;

  const valueTexture = useLabelTexture(String(value), "#FFFFFF", 58);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetY = active
      ? 0.14 + Math.sin(state.clock.elapsedTime * 4) * 0.035
      : 0;

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      5,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* Outer node */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[NODE_WIDTH, NODE_HEIGHT, 0.18]} />

        <meshStandardMaterial
          color={active ? COLORS.active : COLORS.node}
          roughness={0.42}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle top highlight */}
      <mesh position={[0, NODE_HEIGHT / 2 - 0.025, 0.1]}>
        <boxGeometry args={[NODE_WIDTH - 0.04, 0.04, 0.02]} />

        <meshBasicMaterial
          color={active ? "#FFB07D" : COLORS.nodeTop}
        />
      </mesh>

      {/* VALUE */}
      <sprite
        position={[-0.25, 0, 0.15]}
        scale={[0.55, 0.36, 1]}
      >
        <spriteMaterial
          map={valueTexture}
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </sprite>

      {/* NEXT POINTER SLOT */}
      <mesh position={[0.51, 0, 0.12]}>
        <boxGeometry args={[0.30, 0.58, 0.05]} />

        <meshStandardMaterial
          color={active ? "#C96F47" : COLORS.pointer}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

/* ---------------------------------- */
/* ANIMATED POINTER */
/* ---------------------------------- */

function Pointer({
  fromX,
  toX,
  active,
}: {
  fromX: number;
  toX: number;
  active: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const startX = fromX + NODE_WIDTH / 2 + 0.12;
  const endX = toX - NODE_WIDTH / 2 - 0.18;

  const length = endX - startX;

  const geometry = useMemo(() => {
    const points = [
      new THREE.Vector3(startX, 0, 0.35),
      new THREE.Vector3(endX, 0, 0.35),
    ];

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [startX, endX]);

  useFrame((state) => {
    if (!lineRef.current) return;

    const material = lineRef.current.material as THREE.LineBasicMaterial;

    if (active) {
      material.opacity =
        0.65 + Math.sin(state.clock.elapsedTime * 5) * 0.25;
    } else {
      material.opacity = 0.75;
    }
  });

  return (
    <group>
      {/* Connection line */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          color={active ? "#F0925C" : COLORS.arrow}
          transparent
          opacity={0.75}
          depthTest={false}
        />
      </line>

      {/* Arrow head */}
      <mesh
        position={[endX, 0, 0.38]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.10, 0.28, 4]} />

        <meshBasicMaterial
          color={active ? "#F0925C" : COLORS.arrow}
          transparent
          opacity={0.9}
          depthTest={false}
        />
      </mesh>

      {/* Moving signal particle */}
      {active && (
        <FlowParticle
          startX={startX}
          endX={endX}
        />
      )}
    </group>
  );
}

/* ---------------------------------- */
/* FLOW PARTICLE */
/* ---------------------------------- */

function FlowParticle({
  startX,
  endX,
}: {
  startX: number;
  endX: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const t = (state.clock.elapsedTime * 0.8) % 1;

    ref.current.position.x = THREE.MathUtils.lerp(
      startX,
      endX,
      t
    );
  });

  return (
    <mesh ref={ref} position={[startX, 0, 0.5]}>
      <sphereGeometry args={[0.045, 12, 12]} />

      <meshBasicMaterial
        color="#FFD0B5"
        transparent
        opacity={0.9}
        depthTest={false}
      />
    </mesh>
  );
}

/* ---------------------------------- */
/* NULL LABEL */
/* ---------------------------------- */

function NullLabel({ x }: { x: number }) {
  const texture = useLabelTexture("NULL", COLORS.null, 32);

  return (
    <sprite
      position={[x, 0, 0.15]}
      scale={[0.65, 0.25, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  );
}

/* ---------------------------------- */
/* FLOOR */
/* ---------------------------------- */

function Floor({ width }: { width: number }) {
  return (
    <mesh
      position={[0, -0.75, -0.5]}
      rotation={[-Math.PI / 2.3, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[width, 2.5]} />

      <meshStandardMaterial
        color="#0B0B10"
        roughness={1}
      />
    </mesh>
  );
}

/* ---------------------------------- */
/* SCENE */
/* ---------------------------------- */

export function LinkedListScene({
  nodes,
  traversing,
}: {
  nodes: { id: number; value: number }[];
  traversing: number | null;
}) {
  const total = nodes.length;

  const totalWidth = Math.max(
    8,
    (total - 1) * NODE_GAP + NODE_WIDTH + 2.5
  );

  return (
    <Canvas
      orthographic
      camera={{
        position: [0, 0, 10],
        zoom: 90,
      }}
      shadows
    >
      <color attach="background" args={["#08080C"]} />

      <ambientLight intensity={0.75} />

      <directionalLight
        position={[3, 5, 6]}
        intensity={1.2}
        castShadow
      />

      <pointLight
        position={[-4, 2, 4]}
        intensity={0.3}
        color="#7F77DD"
      />

      <pointLight
        position={[4, 1, 4]}
        intensity={0.25}
        color="#5DCAA5"
      />

      <Floor width={totalWidth} />

      {/* POINTERS FIRST */}
      {nodes.slice(0, -1).map((node, index) => {
        const fromX =
          index * NODE_GAP -
          ((total - 1) * NODE_GAP) / 2;

        const toX =
          (index + 1) * NODE_GAP -
          ((total - 1) * NODE_GAP) / 2;

        return (
          <Pointer
            key={`pointer-${node.id}`}
            fromX={fromX}
            toX={toX}
            active={traversing === index}
          />
        );
      })}

      {/* NODES */}
      {nodes.map((node, index) => (
        <ListNode
          key={node.id}
          index={index}
          value={node.value}
          active={traversing === index}
          total={total}
        />
      ))}

      {/* NULL */}
      {total > 0 && (
        <NullLabel
          x={
            (total - 1) * NODE_GAP -
            ((total - 1) * NODE_GAP) / 2 +
            NODE_WIDTH / 2 +
            0.95
          }
        />
      )}
    </Canvas>
  );
}