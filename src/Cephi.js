import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text as DreiText } from "@react-three/drei";
import { useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import Graph from "./Graph";
import WorldMapGraph from "./WorldMapGraph";
import { ScrollControls, Scroll, useScroll, Environment } from "@react-three/drei";

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
    0.12,
    Math.min(viewport.width * 0.05, 0.15)
  );

  return (
    <DreiText
      position={[0, viewport.height / 2 - 1, -1]}
      fontSize={fontSize}
      maxWidth={viewport.width * 0.9}
      lineHeight={1.4}
      anchorX="center"
      anchorY="top"
      textAlign="center"
    >
      {`Cephi is a small, experimental Proof-of-Stake blockchain project built independently as a passion project. It runs on a Byzantine Fault Tolerant (BFT) consensus mechanism and was created purely out of curiosity to explore how decentralized networks and validators actually works.
      
Cephi is not backed by a large team or company.`}
      <meshStandardMaterial
        color="#374152"
        emissive="#767c83"
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </DreiText>
  );
}

/* -------------------- METRICS BOXES -------------------- */
function MetricsInfoBoxes({ position = [0, -1.2, -1], metrics = [] }) {
  const { viewport } = useThree();

  const boxWidth = Math.min(viewport.width * 0.5, 2.5);
  const boxHeight = boxWidth * 0.4;
  const spacing = boxWidth * 0.17;
  const isMobile = viewport.width < 5;

  return (
    <>
      {metrics.map((metric, i) => {
        // ✅ Remove dollar symbols from metric text
        const cleanedMetric = metric.replace(/\$/g, "");

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
          <group
            key={i}
            position={[xPos, position[1] + yPos, position[2]]}
          >
            {/* Glass Panel */}
            <RoundedBox args={[boxWidth, boxHeight, 0.1]} radius={0.1}>
              <meshPhysicalMaterial
                transparent
                transmission={1}
                thickness={0.5}
                roughness={0.05}
                metalness={0.2}
                ior={1.5}
                reflectivity={1}
                clearcoat={1}
                clearcoatRoughness={0.02}
                color="#2a2b2c6e"
                opacity={0.4}
                depthWrite={false}
                envMapIntensity={2}
              />
            </RoundedBox>

            {/* Metric Text */}
            <DreiText
              position={[0, 0, 0.06]}
              fontSize={Math.min(boxHeight * 0.2, 0.2)}
              anchorX="center"
              anchorY="middle"
              textAlign="center"
            >
              {cleanedMetric}
              <meshStandardMaterial
                color="#ffffff"
                emissive="#7a7e85"
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

/* -------------------- BIG TOTAL VOLUME TEXT -------------------- */
function TotalVolumeText({ value }) {
  const { viewport } = useThree();

  const fontSize = Math.max(
    0.4,
    Math.min(viewport.width * 0.09, 0.6)
  );

  return (
    <DreiText
      position={[0, 0, -1]} // Between description and metrics
      fontSize={fontSize}
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      outlineWidth={0.008}     
      outlineColor="#434547"
    >
      {`Network Volume: ${value}`}
      <meshStandardMaterial
        color="#434547"
        emissive="#484a4d"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </DreiText>
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

/* -------------------- HEADING -------------------- */
function Heading() {
  const { viewport } = useThree();

  const fontSize = Math.max(
    0.3,
    Math.min(viewport.width * 0.06, 0.25)
  );

  return (
    <DreiText
      position={[0, viewport.height / 2 - 0.2, -1]}
      fontSize={fontSize}
      anchorX="center"
      anchorY="top"
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

/* -------------------- SCROLL CONTENT -------------------- */
function ScrollContent({ metrics, totalVolume }) {
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
      <Heading />
      <Description />

      {/* PAGE 2 — Network Volume */}
      {totalVolume && <TotalVolumeText value={totalVolume} />}

      {/* PAGE 3 — Metrics */}
      {metrics.length > 0 && (
        <MetricsInfoBoxes
          position={[0, -1.5, 0]} // shifted down below volume
          metrics={metrics}
        />
      )}

      {/* PAGE 4 — Graph */}
      <WorldMapGraph position={[0, -7, 0]} />
      <Graph position={[0, -11, 0]} />
      

    </group>
    
  );
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function Cephi() {
  const [metrics, setMetrics] = useState([]);
  const [totalVolume, setTotalVolume] = useState("");

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/cxgowda/cephi_data/main/project_data.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data.metrics);

        const volumeItem = data.metrics.find((item) =>
          item.startsWith("Total Volume")
        );

        if (volumeItem) {
          let value = volumeItem.split("\n")[1] || "";

          // Remove all non-numeric except dot
          value = value.replace(/[^0-9.]/g, "");

          setTotalVolume(value);
        }
      })
      .catch((err) => {
        console.error("Error fetching JSON:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#050505"]} />
        <Stars />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -5, 5]} intensity={2} />

        <Environment preset="studio" />

        <ScrollControls pages={4} damping={0.3}>
          <Scroll>
            <ScrollContent
              metrics={metrics}
              totalVolume={totalVolume}
            />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
