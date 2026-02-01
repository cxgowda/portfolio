import { useFrame } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
import InfoBox from "./InfoBox";
import VideoCircle from "./VideoCircle";


export default function Scene() {
  const group = useRef();
  const scroll = useScroll();

  const textRef1 = useRef(); // first line
  const textRef2 = useRef(); // second line
  const textRef3 = useRef();


  const { scene, animations } = useGLTF("/models/sapcesuit1.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }

     
    // Set initial opacity for text to 0
    if (textRef1.current?.material) {
      textRef1.current.material.transparent = true;
      textRef1.current.material.opacity = 0;
    }
    if (textRef2.current?.material) {
      textRef2.current.material.transparent = true;
      textRef2.current.material.opacity = 0;
    }
    if (textRef3.current?.material) {
      textRef3.current.material.transparent = true;
      textRef3.current.material.opacity = 0;
    }
  }, [actions]);

  useFrame(() => {
    const offset = scroll.offset;

    if (!group.current) return;

    // --------------------------
    // Model behavior (unchanged)
    // --------------------------
    group.current.position.y = -offset * 4;
    group.current.rotation.y = offset * Math.PI * 2;
    const s = 1 + offset;
    group.current.scale.set(s, s, s);

    // --------------------------
    // Text fade-in independently
    // --------------------------
    if (textRef1.current?.material) {
      const fade1 = Math.min(Math.max(offset - 0.08, 0) * 2, 1); // start at 10% scroll
      textRef1.current.material.opacity = fade1;
    }

    if (textRef2.current?.material) {
      const fade2 = Math.min(Math.max(offset - 0.60, 0) * 3, 1); // start at 30% scroll
      textRef2.current.material.opacity = fade2;
    }

    if (textRef3.current?.material) {
      const fade3 = Math.min(Math.max(offset - 0.6, 0) * 2, 1); // start at 30% scroll
      textRef3.current.material.opacity = fade3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <group ref={group}>
        <primitive object={scene} />
      </group>

      {/* First line */}
      <Text
        ref={textRef1}
        position={[-0.6,1.5, 0]}
        fontSize={0.1}         
        color="#6eacafff"
        anchorX="center"
        anchorY="middle"
        material-transparent={true} // ensures transparency works
      >
        {"👜Software Engineer\n     Bengaluru, India"}
       
      </Text>
      

      {/* Second line */}
     <Text
        ref={textRef2}
        position={[-0.72, 1.1, 0]}
        fontSize={0.1}         
        color="#aaced0ff"
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
      >
        {"👷‍♂️Devian\n     Founder, CTO"}

      </Text>




      <InfoBox />


    </>
  );
}

useGLTF.preload("/models/sapcesuit1.glb");
