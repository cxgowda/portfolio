import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useRef } from "react";

export default function Scene() {
  const mesh = useRef();
  const scroll = useScroll();

  useFrame(() => {
    const scrollOffset = scroll.offset; // 0 → 1

    // Move object vertically
    mesh.current.position.y = -scrollOffset * 4;

    // Rotate as you scroll
    mesh.current.rotation.y = scrollOffset * Math.PI * 2;

    // Scale effect
    const scale = 1 + scrollOffset;
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <mesh ref={mesh}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#00aaff"} />
      </mesh>
    </>
  );
}
