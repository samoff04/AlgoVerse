import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BLOCK_WIDTH = 1.55;
const BLOCK_HEIGHT = 0.72;
const BLOCK_DEPTH = 0.18;
const STACK_GAP = 0.12;

const COLORS = {
  idle: {
    top: "#8178E5",
    bottom: "#5E56B8",
  },
  top: {
    top: "#F6A66B",
    bottom: "#D9783F",
  },
  active: {
    top: "#73D9BC",
    bottom: "#3DAE8D",
  },
};

type StackNode = {
  id: number;
  value: number;
};

type StackOperation =
  | { type: "push"; id: number }
  | { type: "pop"; id: number }
  | { type: "peek"; id: number }
  | { type: "access"; id: number }
  | null;

function useLabelTexture(
  text: string,
  color = "#ffffff",
  size = 64,
  bold = true
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 160;

    const ctx = canvas.getContext("2d")!;

    ctx.font = `${bold ? "700" : "500"} ${size}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 8;

    ctx.fillText(text, 128, 80);

    const texture = new THREE.CanvasTexture(canvas);

    texture.needsUpdate = true;
    texture.anisotropy = 4;

    return texture;
  }, [text, color, size, bold]);
}

function stackY(index: number) {
  return index * (BLOCK_HEIGHT + STACK_GAP) - 1.6;
}

function StackBlock({
  node,
  index,
  total,
  operation,
}: {
  node: StackNode;
  index: number;
  total: number;
  operation: StackOperation;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const isTop = index === total - 1;

  const isActive =
    operation?.id === node.id &&
    (operation.type === "peek" || operation.type === "access");

  const isPushing =
    operation?.id === node.id && operation.type === "push";

  const isPopping =
    operation?.id === node.id && operation.type === "pop";

  const targetY = stackY(index);

  const texture = useLabelTexture(String(node.value));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;

    /**
     * NORMAL STACK MOVEMENT
     *
     * Every block smoothly shifts to its new stack position.
     */
    const currentY = group.position.y;

    group.position.y = THREE.MathUtils.damp(
      currentY,
      targetY,
      4.5,
      delta
    );

    /**
     * PUSH ANIMATION
     *
     * The new block enters from below and rises into position.
     */
    if (isPushing) {
      const pushProgress = Math.min(
        Math.abs(targetY - currentY) / 1.5,
        1
      );

      group.position.z =
        0.15 + Math.sin(pushProgress * Math.PI) * 0.35;

      group.rotation.z =
        Math.sin(pushProgress * Math.PI) * 0.025;
    }

    /**
     * PEEK / ACCESS ANIMATION
     *
     * The selected block gently rises and floats.
     */
    if (isActive) {
      const float =
        Math.sin(state.clock.elapsedTime * 4.5) * 0.045;

      group.position.y += 0.12 + float;
      group.position.z = 0.28;

      group.rotation.z =
        Math.sin(state.clock.elapsedTime * 3) * 0.025;
    }

    /**
     * POP ANIMATION
     *
     * The top block lifts outward before disappearing.
     */
    if (isPopping) {
      group.position.y += 0.7;
      group.position.z = 0.55;

      group.rotation.z = THREE.MathUtils.damp(
        group.rotation.z,
        -0.12,
        4,
        delta
      );

      const scale = THREE.MathUtils.damp(
        group.scale.x,
        0.92,
        3,
        delta
      );

      group.scale.setScalar(scale);
    }

    /**
     * TOP BLOCK IDLE FLOAT
     */
    if (isTop && !isPopping && !isActive) {
      group.position.y +=
        Math.sin(state.clock.elapsedTime * 1.5 + node.id) *
        0.012;
    }

    /**
     * GLOW ANIMATION
     */
    if (glowRef.current) {
      const material =
        glowRef.current.material as THREE.MeshBasicMaterial;

      const shouldGlow =
        isTop || isActive || isPushing || isPopping;

      const targetOpacity = shouldGlow
        ? 0.18 + Math.sin(state.clock.elapsedTime * 5) * 0.08
        : 0;

      material.opacity = THREE.MathUtils.damp(
        material.opacity,
        targetOpacity,
        5,
        delta
      );
    }
  });

  const color = isActive
    ? COLORS.active
    : isTop
      ? COLORS.top
      : COLORS.idle;

  return (
    <group
      ref={groupRef}
      position={[0, targetY - (isPushing ? 1.5 : 0), 0]}
    >
      {/* OUTER GLOW */}
      <mesh ref={glowRef} position={[0, 0, -0.12]}>
        <boxGeometry
          args={[
            BLOCK_WIDTH + 0.22,
            BLOCK_HEIGHT + 0.22,
            0.08,
          ]}
        />

        <meshBasicMaterial
          color={isActive ? "#63D6B4" : "#F5A467"}
          transparent
          opacity={0}
        />
      </mesh>

      {/* MAIN BLOCK */}
      <mesh castShadow receiveShadow>
        <boxGeometry
          args={[
            BLOCK_WIDTH,
            BLOCK_HEIGHT,
            BLOCK_DEPTH,
          ]}
        />

        <meshStandardMaterial
          color={color.top}
          roughness={0.3}
          metalness={0.08}
        />
      </mesh>

      {/* VALUE */}
      <sprite
        position={[0, 0, BLOCK_DEPTH / 2 + 0.02]}
        scale={[0.72, 0.45, 1]}
      >
        <spriteMaterial
          map={texture}
          transparent
          depthWrite={false}
        />
      </sprite>

      {/* TOP LABEL */}
      {isTop && (
        <TopIndicator />
      )}
    </group>
  );
}

function TopIndicator() {
  const texture = useLabelTexture(
    "TOP",
    "#F5A467",
    38,
    true
  );

  return (
    <sprite
      position={[
        BLOCK_WIDTH / 2 + 0.42,
        0,
        0.1,
      ]}
      scale={[0.45, 0.22, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

function StackBase({ total }: { total: number }) {
  const height = Math.max(
    3.5,
    total * (BLOCK_HEIGHT + STACK_GAP) + 1.4
  );

  return (
    <group position={[0, -1.95, -0.25]}>
      {/* BASE PLATFORM */}
      <mesh receiveShadow>
        <boxGeometry args={[2.5, 0.22, 1.25]} />

        <meshStandardMaterial
          color="#101016"
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {/* VERTICAL GUIDE */}
      <mesh position={[0, height / 2, -0.12]}>
        <boxGeometry args={[0.035, height, 0.035]} />

        <meshBasicMaterial
          color="#373741"
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function StackTitle() {
  const texture = useLabelTexture(
    "STACK",
    "#777783",
    42,
    true
  );

  return (
    <sprite
      position={[0, 1.55, 0]}
      scale={[0.65, 0.22, 1]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

export function StackScene({
  stack,
  operation = null,
}: {
  stack: StackNode[];
  operation?: StackOperation;
}) {
  return (
    <Canvas
      orthographic
      camera={{
        position: [0, 0, 10],
        zoom: 90,
      }}
      shadows
    >
      <color
        attach="background"
        args={["#08080C"]}
      />

      {/* SOFT AMBIENT LIGHT */}
      <ambientLight intensity={0.65} />

      {/* KEY LIGHT */}
      <directionalLight
        position={[4, 6, 7]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* PURPLE RIM LIGHT */}
      <pointLight
        position={[-4, 2, 4]}
        intensity={0.45}
        color="#756BE0"
      />

      {/* GREEN RIM LIGHT */}
      <pointLight
        position={[4, -1, 4]}
        intensity={0.3}
        color="#50C8A4"
      />

      <StackTitle />

      <StackBase total={stack.length} />

      {stack.map((node, index) => (
        <StackBlock
          key={node.id}
          node={node}
          index={index}
          total={stack.length}
          operation={operation}
        />
      ))}
    </Canvas>
  );
}