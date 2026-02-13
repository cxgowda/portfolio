import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text as DreiText, useGLTF } from "@react-three/drei";

import { useMemo, useRef } from "react";
import * as THREE from "three";



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
    0.30,                         // minimum size (mobile)
    Math.min(viewport.width * 0.06, 0.25) // max size (desktop)
  );

  return (
    <DreiText
      position={[
        -viewport.width / 2 + 0.001,
        viewport.height / 2 - 0.001,
        -1
      ]}
      fontSize={fontSize}
      anchorX="left"
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


/* -------------------- DESCRIPTION -------------------- */
function Description() {
  const { viewport } = useThree();

  const fontSize = Math.max(
    0.15,                          // minimum mobile size
    Math.min(viewport.width * 0.1, 0.15) // max desktop size
  );

  return (
    <DreiText
      position={[
        -viewport.width / 2 + 0.001,
        viewport.height / 2 - 0.6,
        -1
      ]}
      fontSize={fontSize}
      maxWidth={viewport.width * 1.0}
      lineHeight={1.4}
      anchorX="left"
      anchorY="top"
      textAlign="left"
    >
      {`Cephi is a small, experimental Proof-of-Stake blockchain project built independently by Chiranth Gowda as a passion project. It runs on a Byzantine Fault Tolerant (BFT) consensus mechanism and was created purely out of curiosity to explore how decentralized networks and validators actually works.
      \nCephi is not backed by a large team or company. `}
      <meshStandardMaterial
        color="#374152"
        emissive="#767c83"
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </DreiText>
  );
}


/* -------------------- Metrics -------------------- */
function GeneralMetrics() {
  const { viewport } = useThree();

  const fontSize = Math.max(0.15, Math.min(viewport.width * 0.1, 0.15));

  return (
    <DreiText
      position={[-viewport.width / 2 + 0.001, viewport.height / 2.6 - 1.8, -1]}
      fontSize={fontSize}
      maxWidth={viewport.width * 1.0}
      lineHeight={1.4}
      anchorX="left"
      anchorY="top"
      textAlign="left"
    >
      {/* your text */}
      {`Total Nodes: 2\nTest Tokens Staked: 500+ \nNetworks Supported: 1\nTotal Volume Catered: $40`}
      <meshStandardMaterial
        color="#374152"
        emissive="#767c83"
        emissiveIntensity={1.2}
        toneMapped={false}
      />
    </DreiText>
  );
}



/* -------------------- INFO BOX (GLASS ONLY) -------------------- */
function InfoBox({ position = [0, 0.05, -1.5], children }) {
  const { viewport } = useThree();

  const boxWidth = Math.min(viewport.width * 1.3, 9);
  const boxHeight = boxWidth * 0.6;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, -5, 5]} intensity={1.5} />

      <RoundedBox
        position={position}
        args={[boxWidth, boxHeight, 0.15]}
        radius={0.12}
        smoothness={10}
      >
        <meshPhysicalMaterial
          transparent
          transmission={1}
          thickness={0.6}
          roughness={0.15}
          metalness={0}
          ior={1.45}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={2}
          color="#363941"
          opacity={0.6}
          depthWrite={false}
        />
      </RoundedBox>

    </>
  );
}



/* -------------------- MAIN CEPHI PAGE -------------------- */
export default function Cephi() {
  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>

      
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
  <Stars />
   
  <Heading />
  <Description />
  <GeneralMetrics />
    <InfoBox position={[0, -1.5, -2]} />

</Canvas>

      

    
       
      
    </div>
  );
}
