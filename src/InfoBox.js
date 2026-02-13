import { RoundedBox, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function InfoBox() {
  const boxRef = useRef();
  const scroll = useScroll();

useFrame(() => {
  const offset = scroll.offset; // 0 → 1
  const totalPages = 4;
  const pageLength = 1 / totalPages;

  // Grow during page 1
  let page1Progress = Math.min(offset / pageLength, 1);

  // Shrink faster when scrolling past page 1
  if (offset > pageLength) {
    const page2Progress = Math.min((offset - pageLength) / pageLength, 1);
    const shrinkSpeed = 2.0; // >1 = faster shrink
    page1Progress = Math.max(1 - page2Progress * shrinkSpeed, 0);
  }

  if (boxRef.current) {
    const height = page1Progress * 2; // max height = 2
    boxRef.current.scale.set(3, height, 0.12);
    boxRef.current.position.y = 1.8 - height / 2;
    boxRef.current.visible = height > 0.02;
  }
});

  return (
    <RoundedBox ref={boxRef} args={[1, 1, 0.12]} radius={0.1} smoothness={10}>
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
  );
}
