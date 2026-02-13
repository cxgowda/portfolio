import { useFrame } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import InfoBox from "./InfoBox";


export default function Scene() {
  const group = useRef();
  const moonRef = useRef();
  const scroll = useScroll();
  {/*const navigate = useNavigate();  -- Use this like when button is enabled*/}

  const textRef1 = useRef();
  const textRef2 = useRef();
  const textRef3 = useRef();

  // Spacesuit model
  const { scene, animations } = useGLTF("/models/sapcesuit1.glb");
  const { actions } = useAnimations(animations, group);

  // Moon model
  const { scene: moonScene } = useGLTF("/models/moon2.glb");

  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      firstAction?.play();
    }

    // Initial text opacity
    [textRef1, textRef2, textRef3].forEach((ref) => {
      if (ref.current?.material) {
        ref.current.material.transparent = true;
        ref.current.material.opacity = 0;
      }
    });
  }, [actions]);

  useFrame(() => {
    const offset = scroll.offset;
    if (!group.current) return;

    // Spacesuit animation
    group.current.position.y = -offset * 4;
    group.current.rotation.y = offset * Math.PI * 2;
    const s = 1 + offset;
    group.current.scale.set(s, s, s);

    // Moon animation
  if (moonRef.current) {
  const minScale = 0.8;
  const maxScale = 1.2;

  const scale = minScale + scroll.offset * (maxScale - minScale);
  moonRef.current.scale.set(scale, scale, scale);

  moonRef.current.rotation.y += 0.005;
  moonRef.current.rotation.z += 0.005;
  moonRef.current.position.y = 1 - scroll.offset * 2.5;
}

    // Text fade-ins
    if (textRef1.current?.material) {
      textRef1.current.material.opacity = Math.min(
        Math.max(offset - 0.18, 0) * 2,
        1
      );
    }

    if (textRef2.current?.material) {
      textRef2.current.material.opacity = Math.min(
        Math.max(offset - 0.34, 0) * 2,
        1
      );
    }

    if (textRef3.current?.material) {
      textRef3.current.material.opacity = Math.min(
        Math.max(offset - 0.6, 0) * 2,
        1
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* Spacesuit */}
      <group ref={group}>
        <primitive object={scene} />
      </group>

      {/* Moon */}
      <group ref={moonRef} position={[2, 1, -2]} scale={0.5}>
        <primitive object={moonScene} />
      </group>

      {/* Text 1 */}
      <Text
        ref={textRef1}
        position={[-0.6, 1.5, 0]}
        fontSize={0.1}
        color="rgb(130, 176, 179)"
        anchorX="center"
        anchorY="middle"
        material-transparent
      >
        {"👜 Software Engineer\nBengaluru, India"}
      </Text>

      {/* Text 2 */}
      <Text
        ref={textRef2}
        position={[-0.72, 1.1, 0]}
        fontSize={0.1}
        color="rgb(130, 176, 179)"
        anchorX="center"
        anchorY="middle"
        material-transparent
      >
        {"👷‍♂️ Devian\nFounder, CTO"}
      </Text>

      {/* Text 3 */}
      <Text
        ref={textRef3}
        position={[0.05, 0.7, 0]}
        fontSize={0.1}
        color="rgb(130, 176, 179)"
        anchorX="center"
        anchorY="middle"
        material-transparent
      >
        {"👽 Currently not working on this,\ncome back later"}
      </Text>

      {/* Navigation Button *
      
      
      import { useScroll, useGLTF, useAnimations, Text, Html } from "@react-three/drei";

      Replace this line such that it contains html when button is enabled or the build will fail.
      
      /}
           {/* <Html position={[0, -1.5, 0]}>
              <button
                onClick={() => navigate("/cephi")}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  background: "rgb(130, 176, 179)",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Enter Cephi
              </button>
            </Html> */}

      <InfoBox />
    </>
  );
}

// Preload models
useGLTF.preload("/models/sapcesuit1.glb");
useGLTF.preload("/models/moon2.glb");
