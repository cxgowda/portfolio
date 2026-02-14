import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text as DreiText } from "@react-three/drei";

import { useMemo, useRef,  useEffect, useState  } from "react";
import * as THREE from "three";
import Graph from "./Graph";
import { ScrollControls, Scroll, useScroll } from "@react-three/drei";




/* -------------------- STAR TEXTURE -------------------- */
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

  gradient.addColorStop(0, "rgb(165, 139, 139)");
  gradient.addColorStop(0.2, "rgba(63, 60, 60, 0.8)");
  gradient.addColorStop(0.5, "rgba(48, 46, 46, 0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}


/* -------------------- DESCRIPTION -------------------- */
function Description() {
  const { viewport } = useThree();

  const fontSize = Math.max(
    0.12,                          // minimum mobile size
    Math.min(viewport.width * 0.05, 0.15) // max desktop size
  );

  return (
    <DreiText
      position={[
        0,                        // center horizontally
        viewport.height / 2 - 1,  // slightly below heading
        -1
      ]}
      fontSize={fontSize}
      maxWidth={viewport.width * 0.9} // prevent overflowing
      lineHeight={1.4}
      anchorX="center"   // center text horizontally
      anchorY="top"      // align from top vertically
      textAlign="center" // center multi-line text
    >
      {`Cephi is a small, experimental Proof-of-Stake blockchain project built independently as a passion project. It runs on a Byzantine Fault Tolerant (BFT) consensus mechanism and was created purely out of curiosity to explore how decentralized networks and validators actually works.
      \nCephi is not backed by a large team or company.`}
      <meshStandardMaterial
        color="#374152"
        emissive="#767c83"
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </DreiText>
  );
}

/* -------------------- METRICS INFOBOXES (SHINY GLASS) -------------------- */
function MetricsInfoBoxes({ position = [0, -1.2, -1], metrics = [] }) {
  const { viewport } = useThree();

  const boxWidth = Math.min(viewport.width * 0.50, 2.5);
  const boxHeight = boxWidth * 0.4;
  const spacing = boxWidth * 0.17;

  const isMobile = viewport.width < 5;

  return (
    <>
      {metrics.map((metric, i) => {
        let xPos = 0;
        let yPos = 0;

        if (isMobile) {
          xPos = 0;
          yPos = -i * (boxHeight + spacing);
        } else {
          xPos = (i - (metrics.length - 1) / 2) * (boxWidth + spacing);
          yPos = 0;
        }

        return (
          <group key={i} position={[xPos, position[1] + yPos, position[2]]}>
            {/* Shiny Glass Panel */}
            <RoundedBox
              args={[boxWidth, boxHeight, 0.1]}
              radius={0.10}
              smoothness={5}
            >
              <meshPhysicalMaterial
                transparent
                transmission={1}           // full glass effect
                thickness={0.5}
                roughness={0.05}           // smooth → shiny
                metalness={0.2}            // subtle reflection
                ior={1.5}                  // index of refraction
                reflectivity={1.0}         // mirror-like reflection
                clearcoat={1}              // glossy layer
                clearcoatRoughness={0.02}  // very smooth
                color="#2a2b2c6e"
                opacity={0.4}
                depthWrite={false}
                envMapIntensity={2}        // reflections from environment
              />
            </RoundedBox>

            {/* Metric Text */}
            <DreiText
              position={[0, 0, 0.06]}
              fontSize={Math.min(boxHeight * 0.20, 0.20)}
              anchorX="center"
              anchorY="middle"
              textAlign="center"
            >
              {metric}
              <meshStandardMaterial
                color="#ffffff"
                emissive="#7a7e85"        // subtle glow
                emissiveIntensity={0.7}
                toneMapped={false}
              />
            </DreiText>
          </group>
        );
      })}
    </>
  );
}





/* -------------------- STARS -------------------- */
function Stars() {
  const pointsRef = useRef();
  const starCount = 300;
  const maxDepth = 200;

  const positions = useMemo(() => {
    const arr = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 300;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 200;
      arr[i * 3 + 2] = -Math.random() * maxDepth;
    }

    return arr;
  }, []);

  const texture = useMemo(() => createGlowTexture(), []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positionsArray =
      pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < starCount; i++) {
      let zIndex = i * 3 + 2;

      positionsArray[zIndex] += 0.15;

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


function Heading() {
  const { viewport } = useThree();

  const fontSize = Math.max(
    0.30,                         // minimum size (mobile)
    Math.min(viewport.width * 0.06, 0.25) // max size (desktop)
  );

  return (
    <DreiText
      position={[0, viewport.height / 2 - 0.2, -1]} // x=0 (center), y slightly down from top
      fontSize={fontSize}
      anchorX="center"  // center horizontally
      anchorY="top"     // stay at top vertically
      letterSpacing={0.1}
    >
      CEPHI
      <meshStandardMaterial
        color="#182233"
        emissive="#62686e"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </DreiText>
  );
}


function ScrollContent({ metrics }) {
  const scroll = useScroll();
  const group = useRef();

  useFrame(() => {
    if (group.current) {
      group.current.position.y = -scroll.offset * 8;
    }
  });

  return (
    <group ref={group}>
      {/* PAGE 1 */}
      <Heading position={[0, 2, 0]} />
      <Description position={[0, 1, 0]} />

      {/* PAGE 2 */}
      {metrics.length > 0 && (
        <MetricsInfoBoxes
          position={[0, 0, 0]}
          metrics={metrics}
        />
      )}

      {/* PAGE 3 */}
      {/*<Graph position={[-2, -5, 0]} />          ------- for graph activation*/}
    </group>
  );
}

export default function Cephi() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/cxgowda/cephi_data/main/project_data.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data.metrics);
      })
      .catch((err) => {
        console.error("Error fetching JSON:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Stars />

        <ScrollControls pages={3} damping={0.30}>
          <Scroll>
            <ScrollContent metrics={metrics} />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}