import { Canvas, useFrame } from "@react-three/fiber";
import type {
  VisualState,
  VisualElement,
} from "../../engine-core/replay";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CELL_WIDTH = 1.15;
const CELL_HEIGHT = 0.85;
const CELL_DEPTH = 0.14;
const CELL_GAP = 0.16;

const MAX_VISIBLE_WIDTH = 11.5;

const PALETTE = {
  idle: {
    top: "#8B7FE8",
    bottom: "#6A5FC4",
  },
  comparing: {
    top: "#F5A467",
    bottom: "#E0813C",
  },
  sorted: {
    top: "#63D6B4",
    bottom: "#3EAE8C",
  },
};

function slotX(index: number, total: number) {
  const width = CELL_WIDTH + CELL_GAP;

  return (
    index * width -
    ((total - 1) * width) / 2
  );
}

/* -------------------------------------------------------------------------- */
/*                              TEXTURES                                      */
/* -------------------------------------------------------------------------- */

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);

  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);

  ctx.closePath();
}

function useCellTexture(
  value: number,
  colorState: "idle" | "comparing" | "sorted"
) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 256;
    canvas.height = 190;

    const ctx = canvas.getContext("2d")!;

    const { top, bottom } =
      PALETTE[colorState];

    roundedRectPath(
      ctx,
      4,
      4,
      248,
      182,
      22
    );

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        0,
        190
      );

    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();

    roundedRectPath(
      ctx,
      4,
      4,
      248,
      60,
      22
    );

    ctx.clip();

    const sheen =
      ctx.createLinearGradient(
        0,
        4,
        0,
        64
      );

    sheen.addColorStop(
      0,
      "rgba(255,255,255,0.22)"
    );

    sheen.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    ctx.fillStyle = sheen;
    ctx.fillRect(
      0,
      0,
      256,
      190
    );

    ctx.restore();

    ctx.fillStyle = "#ffffff";

    ctx.font =
      "700 78px sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor =
      "rgba(0,0,0,0.25)";

    ctx.shadowBlur = 6;

    ctx.fillText(
      String(value),
      128,
      100
    );

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    texture.needsUpdate = true;
    texture.anisotropy = 4;

    return texture;
  }, [value, colorState]);
}

function useLabelTexture(
  text: string,
  color = "#8b8b96",
  size = 46
) {
  return useMemo(() => {
    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = 128;
    canvas.height = 128;

    const ctx =
      canvas.getContext("2d")!;

    ctx.font = `600 ${size}px sans-serif`;

    ctx.fillStyle = color;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      text,
      64,
      64
    );

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    texture.needsUpdate = true;

    return texture;
  }, [text, color, size]);
}

/* -------------------------------------------------------------------------- */
/*                              INDEX LABEL                                   */
/* -------------------------------------------------------------------------- */

function IndexLabel({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  const texture =
    useLabelTexture(
      String(index)
    );

  return (
    <sprite
      position={[
        slotX(index, total),
        -0.72,
        0,
      ]}
      scale={[
        0.28,
        0.28,
        1,
      ]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MOVEMENT GLOW                                 */
/* -------------------------------------------------------------------------- */

function MovementGlow({
  active,
  color,
}: {
  active: boolean;
  color: string;
}) {
  const ref =
    useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const material =
      ref.current.material as THREE.MeshBasicMaterial;

    const pulse =
      0.22 +
      Math.sin(
        state.clock.elapsedTime * 8
      ) *
        0.08;

    material.opacity = active
      ? pulse
      : 0;
  });

  return (
    <mesh
      ref={ref}
      position={[
        0,
        0,
        -0.12,
      ]}
      scale={[
        1.18,
        1.08,
        1,
      ]}
    >
      <planeGeometry
        args={[
          CELL_WIDTH,
          CELL_HEIGHT,
        ]}
      />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ARRAY VALUE                                   */
/* -------------------------------------------------------------------------- */

function ArrayValue({
  el,
  total,
  comparing,
  sorted,
}: {
  el: VisualElement;
  total: number;
  comparing: boolean;
  sorted: boolean;
}) {
  const groupRef =
    useRef<THREE.Group>(null);

  const previousIndex =
    useRef(el.index);

  const animation =
    useRef({
      progress: 1,
      fromX: slotX(
        el.index,
        total
      ),
      toX: slotX(
        el.index,
        total
      ),
      direction: 0,
    });

  const targetX =
    slotX(el.index, total);

  const colorState =
    sorted
      ? "sorted"
      : comparing
        ? "comparing"
        : "idle";

  const texture =
    useCellTexture(
      el.value,
      colorState
    );

  const movementColor =
    sorted
      ? "#63D6B4"
      : comparing
        ? "#F5A467"
        : "#8B7FE8";

  /*
   * Detect movement between replay states.
   */
  if (
    previousIndex.current !==
    el.index
  ) {
    const oldX =
      slotX(
        previousIndex.current,
        total
      );

    const newX =
      targetX;

    animation.current.fromX =
      oldX;

    animation.current.toX =
      newX;

    animation.current.progress =
      0;

    animation.current.direction =
      el.index >
      previousIndex.current
        ? 1
        : -1;

    previousIndex.current =
      el.index;
  }

  useFrame(
    (state, delta) => {
      if (!groupRef.current)
        return;

      const data =
        animation.current;

      data.progress =
        THREE.MathUtils.damp(
          data.progress,
          1,
          3.2,
          delta
        );

      const progress =
        THREE.MathUtils.clamp(
          data.progress,
          0,
          1
        );

      const eased =
        THREE.MathUtils.smoothstep(
          progress,
          0,
          1
        );

      const currentX =
        THREE.MathUtils.lerp(
          data.fromX,
          data.toX,
          eased
        );

      const distance =
        Math.abs(
          data.toX -
            data.fromX
        );

      const normalizedDistance =
        THREE.MathUtils.clamp(
          distance /
            CELL_WIDTH,
          0,
          4
        );

      const arcHeight =
        0.55 +
        normalizedDistance *
          0.12;

      const arc =
        Math.sin(
          progress *
            Math.PI
        ) *
        arcHeight;

      const directionalOffset =
        data.direction === 1
          ? 0.08
          : data.direction === -1
            ? -0.04
            : 0;

      const idleAmount =
        progress > 0.96
          ? Math.sin(
              state.clock
                .elapsedTime *
                1.4 +
                el.id
            ) *
            0.025
          : 0;

      groupRef.current.position.x =
        currentX;

      groupRef.current.position.y =
        arc +
        directionalOffset +
        idleAmount;

      groupRef.current.position.z =
        0.02 +
        Math.sin(
          progress *
            Math.PI
        ) *
          0.22;

      const scale =
        1 +
        Math.sin(
          progress *
            Math.PI
        ) *
          0.08;

      groupRef.current.scale.setScalar(
        scale
      );

      groupRef.current.rotation.z =
        Math.sin(
          progress *
            Math.PI
        ) *
        data.direction *
        0.045;
    }
  );

  return (
    <group
      ref={groupRef}
      position={[
        targetX,
        0,
        0.02,
      ]}
    >
      <MovementGlow
        active={
          animation.current
            .progress < 0.98 ||
          comparing
        }
        color={
          movementColor
        }
      />

      <mesh
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            CELL_WIDTH,
            CELL_HEIGHT,
            CELL_DEPTH,
          ]}
        />

        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                              FLOOR                                         */
/* -------------------------------------------------------------------------- */

function Floor({
  total,
  scale,
}: {
  total: number;
  scale: number;
}) {
  const width =
    total *
      (CELL_WIDTH + CELL_GAP) +
    1.5;

  return (
    <mesh
      position={[
        0,
        -1.05,
        -0.3,
      ]}
      rotation={[
        -Math.PI / 2.4,
        0,
        0,
      ]}
      scale={[
        scale,
        scale,
        scale,
      ]}
      receiveShadow
    >
      <planeGeometry
        args={[
          width,
          2.2,
        ]}
      />

      <meshStandardMaterial
        color="#0c0c11"
        roughness={1}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                              LABEL                                         */
/* -------------------------------------------------------------------------- */

function OperationLabel() {
  const texture =
    useLabelTexture(
      "ARRAY",
      "#6b6b76",
      40
    );

  return (
    <sprite
      position={[
        0,
        1.35,
        0,
      ]}
      scale={[
        0.55,
        0.18,
        1,
      ]}
    >
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN SCENE                                    */
/* -------------------------------------------------------------------------- */

export function ArrayScene({
  state,
}: {
  state: VisualState;
}) {
  const total =
    state.elements.length;

  /*
   * Dynamic scale prevents overlap.

   * 1-8 values:
   * full-size beautiful cards

   * More values:
   * entire array scales down proportionally

   * Minimum scale:
   * cards remain readable instead of becoming microscopic.
   */
  const rawWidth =
    total *
      (CELL_WIDTH + CELL_GAP);

  const sceneScale =
    Math.min(
      1,
      MAX_VISIBLE_WIDTH /
        rawWidth
    );

  return (
    <Canvas
      orthographic
      camera={{
        position: [
          0,
          0.6,
          10,
        ],
        zoom: 82,
      }}
      shadows
      dpr={[
        1,
        2,
      ]}
    >
      <color
        attach="background"
        args={[
          "#08080C",
        ]}
      />

      <ambientLight
        intensity={0.7}
      />

      <directionalLight
        position={[
          3,
          6,
          6,
        ]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[
          1024,
          1024,
        ]}
      />

      <pointLight
        position={[
          -4,
          2,
          4,
        ]}
        intensity={0.35}
        color="#7F77DD"
      />

      <pointLight
        position={[
          4,
          2,
          4,
        ]}
        intensity={0.35}
        color="#5DCAA5"
      />

      <group
        scale={[
          sceneScale,
          sceneScale,
          sceneScale,
        ]}
      >
        <OperationLabel />

        <Floor
          total={total}
          scale={1 / sceneScale}
        />

        {state.elements.map(
          (el) => {
            const comparing =
              state.comparing !=
                null &&
              state.comparing.includes(
                el.index
              );

            const sorted =
              state.sorted.has(
                el.index
              );

            return (
              <ArrayValue
                key={el.id}
                el={el}
                total={total}
                comparing={
                  comparing
                }
                sorted={sorted}
              />
            );
          }
        )}

        {Array.from({
          length: total,
        }).map(
          (_, index) => (
            <IndexLabel
              key={index}
              index={index}
              total={total}
            />
          )
        )}
      </group>
    </Canvas>
  );
}