import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { TreeNode } from "../../engine-core/algorithms/bst";

function useLabelTexture(
  text: string,
  color = "#ffffff",
  size = 180
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, 512, 512);

    ctx.font = `900 ${size}px Arial, sans-serif`;

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 12;

    ctx.fillText(text, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);

    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8;

    return texture;
  }, [text, color, size]);
}

/* ------------------------------------------------ */
/* TREE LAYOUT */
/* ------------------------------------------------ */

function layoutTree(
  nodes: Record<string, TreeNode>,
  rootId: string | null
) {
  const layout: Record<string, LayoutNode> = {};

  if (!rootId || !nodes[rootId]) {
    return layout;
  }

  let order = 0;

  function calculateLayout(id: string, depth: number) {
    const node = nodes[id];

    if (!node) return;

    if (node.left && nodes[node.left]) {
      calculateLayout(node.left, depth + 1);
    }

    layout[id] = {
      ...node,
      x: order * 1.65,
      y: -depth * 1.55,
      depth,
    };

    order++;

    if (node.right && nodes[node.right]) {
      calculateLayout(node.right, depth + 1);
    }
  }

  calculateLayout(rootId, 0);

  const positions = Object.values(layout);

  if (positions.length === 0) {
    return layout;
  }

  const minX = Math.min(...positions.map((node) => node.x));
  const maxX = Math.max(...positions.map((node) => node.x));

  const center = (minX + maxX) / 2;

  Object.values(layout).forEach((node) => {
    node.x -= center;
  });

  return layout;
}

/* ------------------------------------------------ */
/* EDGE */
/* ------------------------------------------------ */

function Edge({
  from,
  to,
}: {
  from: LayoutNode;
  to: LayoutNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const direction = useMemo(() => {
    return new THREE.Vector3(
      to.x - from.x,
      to.y - from.y,
      0
    );
  }, [from.x, from.y, to.x, to.y]);

  const length = direction.length();

  const angle = Math.atan2(direction.y, direction.x);

  const midpoint = useMemo(
    () => ({
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2,
    }),
    [from.x, from.y, to.x, to.y]
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.scale.x = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      1,
      3.5,
      delta
    );
  });

  return (
    <group
      ref={groupRef}
      position={[midpoint.x, midpoint.y, -0.1]}
      rotation={[0, 0, angle]}
      scale={[0.01, 1, 1]}
    >
      {/* Main connection */}
      <mesh>
        <boxGeometry args={[length, 0.055, 0.055]} />

        <meshBasicMaterial
          color="#454452"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Direction indicator */}
      <mesh
        position={[length / 2 - 0.12, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.09, 0.22, 6]} />

        <meshBasicMaterial
          color="#77718f"
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------ */
/* NODE */
/* ------------------------------------------------ */

function TreeNodeMesh({
  node,
  active,
}: {
  node: LayoutNode;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = useLabelTexture(
    String(node.value),
    "#ffffff",
    180
  );

  const targetPosition = new THREE.Vector3(
    node.x,
    node.y,
    0
  );

  const wasCreated = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow smooth movement
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPosition.x,
      3.2,
      delta
    );

    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosition.y,
      3.2,
      delta
    );

    // Slow pop-in
    if (!wasCreated.current) {
      groupRef.current.scale.lerp(
        new THREE.Vector3(1, 1, 1),
        1 - Math.exp(-3.5 * delta)
      );

      if (groupRef.current.scale.x > 0.98) {
        wasCreated.current = true;
      }
    }

    // Active node floating
    if (active) {
      groupRef.current.position.z =
        0.12 +
        Math.sin(state.clock.elapsedTime * 2.8) * 0.055;
    } else {
      groupRef.current.position.z = 0;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[
        targetPosition.x,
        targetPosition.y,
        0,
      ]}
      scale={[0.05, 0.05, 0.05]}
    >
      {/* Outer glow */}
      <mesh position={[0, 0, -0.08]}>
        <sphereGeometry args={[0.68, 40, 40]} />

        <meshBasicMaterial
          color={active ? "#F0925C" : "#7F77DD"}
          transparent
          opacity={active ? 0.32 : 0.14}
        />
      </mesh>

      {/* Main node */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.48, 48, 48]} />

        <meshStandardMaterial
          color={active ? "#F0925C" : "#6258C4"}
          roughness={0.26}
          metalness={0.08}
        />
      </mesh>

      {/* Gloss highlight */}
      <mesh position={[-0.15, 0.18, 0.39]}>
        <sphereGeometry args={[0.075, 16, 16]} />

        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.42}
        />
      </mesh>

      {/* NUMBER PLANE */}
      <mesh
        position={[0, 0, 0.62]}
        renderOrder={10}
      >
        <planeGeometry args={[0.7, 0.7]} />

        <meshBasicMaterial
          map={texture}
          transparent
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------ */
/* TREE TITLE */
/* ------------------------------------------------ */

function TreeTitle() {
  const texture = useLabelTexture(
    "BINARY SEARCH TREE",
    "#666671",
    42
  );

  return (
    <sprite
      position={[0, 2.65, 0]}
      scale={[2.9, 0.42, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

/* ------------------------------------------------ */
/* MAIN SCENE */
/* ------------------------------------------------ */

export function TreeScene({
  nodes,
  rootId,
  activeNodeId,
}: {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
  activeNodeId: string | null;
}) {
  const layout = layoutTree(nodes, rootId);

  const edges: [LayoutNode, LayoutNode][] = [];

  Object.values(layout).forEach((node) => {
    if (node.left && layout[node.left]) {
      edges.push([node, layout[node.left]]);
    }

    if (node.right && layout[node.right]) {
      edges.push([node, layout[node.right]]);
    }
  });

  return (
    <Canvas
      orthographic
      camera={{
        position: [0, 0, 10],
        zoom: 82,
      }}
      shadows
    >
      <color
        attach="background"
        args={["#08080C"]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} />

      <directionalLight
        position={[3, 7, 6]}
        intensity={1.3}
        castShadow
      />

      <pointLight
        position={[-4, 2, 4]}
        intensity={0.45}
        color="#7F77DD"
      />

      <pointLight
        position={[4, 1, 4]}
        intensity={0.35}
        color="#F0925C"
      />

      <TreeTitle />

      {/* Edges behind nodes */}
      {edges.map(([from, to]) => (
        <Edge
          key={`${from.id}-${to.id}`}
          from={from}
          to={to}
        />
      ))}

      {/* Nodes */}
      {Object.values(layout).map((node) => (
        <TreeNodeMesh
          key={node.id}
          node={node}
          active={node.id === activeNodeId}
        />
      ))}
    </Canvas>
  );
}