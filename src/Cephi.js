import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

function Stars() {
  const pointsRef = useRef();

  const starCount = 250;
  const maxDepth = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 2] = -Math.random() * maxDepth;
    }

    return arr;
  }, []);

  const texture = useMemo(() => createGlowTexture(), []);

  // Very slow forward drift
  useFrame(() => {
    const positionsArray = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < starCount; i++) {
      let zIndex = i * 3 + 2;

      positionsArray[zIndex] += 0.1; // SPEED (lower = slower)

      // Reset star when it passes camera
      if (positionsArray[zIndex] > 5) {
        positionsArray[zIndex] = -maxDepth;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        map={texture}
        size={1.5}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Cephi() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Stars />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "2rem",
          pointerEvents: "none",
        }}
      >
        🚀 Welcome to Cephi
      </div>
    </div>
  );
}
