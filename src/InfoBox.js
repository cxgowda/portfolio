import { RoundedBox, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function InfoBox() {

  const boxRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const offset = scroll.offset;   // 0 → 1
    const height = offset * 2;

    if (boxRef.current) {
      boxRef.current.scale.set(4, height, 0.12);
      boxRef.current.position.y = 1.8 - height / 2;
      boxRef.current.visible = height > 0.02;
    }
  });

  return (
    <>
      {/* Light for shine */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={3} />
      <directionalLight position={[-5, -5, 5]} intensity={1.5} />

      <RoundedBox
        ref={boxRef}
        args={[1, 1, 0.12]}
        radius={0.10}
        smoothness={10}
      >

        {/* DARK GLASS MATERIAL */}
        <meshPhysicalMaterial
          transparent
          transmission={0.9}
          thickness={0.4}

          roughness={0.18}
          metalness={0}

          ior={1.45}
          reflectivity={1}

          clearcoat={1}
          clearcoatRoughness={0.05}

          envMapIntensity={2}

          color="#393e45"
          opacity={0.55}
          depthWrite={false}
        />

      </RoundedBox>
    </>
  );
}
