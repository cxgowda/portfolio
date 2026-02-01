import { RoundedBox, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Scene() {
  const boxRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const offset = scroll.offset; // 0 → 1
    const height = offset * 1;

    if (boxRef.current) {
      boxRef.current.scale.set(2.7, height, 1);
      boxRef.current.position.y = 1.7 - height / 2;
      boxRef.current.visible = height > 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      
      <RoundedBox
        ref={boxRef}
        args={[1, 1.2, 0.1]}      // width, height, depth (base size)
        radius={0.07}           // 👈 rounded corners
        smoothness={4}
      >
        {/* Gradient material */}
        <meshStandardMaterial
          transparent
          opacity={0.1}
          roughness={0.15}
          metalness={0.6}
          depthWrite={false}
          color="#a7b7b9ff"      // placeholder color for gradient
        />
      </RoundedBox>
    </>
  );
}
