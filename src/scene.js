import { useFrame } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import InfoBox from "./InfoBox";


export default function Scene() {
  const group = useRef();
  const scroll = useScroll();

  const { scene, animations } = useGLTF("/models/model2.glb");
  const { actions } = useAnimations(animations, group);

  // ▶️ Play animation on load
  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }
  }, [actions]);

  useFrame(() => {
    const offset = scroll.offset;

    if (!group.current) return;

    // Scroll movement
    group.current.position.y = -offset * 4;

    // Scroll rotation
    group.current.rotation.y = offset * Math.PI * 2;

    // Scroll scale
    const s = 1 + offset;
    group.current.scale.set(s, s, s);


  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <group ref={group}>
        <primitive object={scene} />
      </group>
      <InfoBox />
    </>
  );
}

useGLTF.preload("/models/model2.glb");

