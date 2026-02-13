import { useFrame } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
import InfoBox from "./InfoBox";

export default function Scene() {
  const group = useRef();
  const moonRef = useRef();
  const scroll = useScroll();
  const boxRef = useRef();

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
  const offset = scroll.offset; // 0 → 1 across all pages
  if (!group.current || !moonRef.current) return;

  const totalPages = 4;
  const pageLength = 1 / totalPages;

  // --- Page progress ---
  const page1Progress = Math.min(offset / pageLength, 1); // Page 1 (0 → 1)
  const page2Progress = offset >= pageLength ? Math.min((offset - pageLength) / pageLength, 1) : 0; // Page 2 (0 → 1)

  // --- PHASE 1: Spacesuit center animation ---
  const phase1EndPos = [0, -4, 0]; // end position for phase1
  const phase1EndScale = 1 + 1;    // scale at end of phase1

  if (page1Progress > 0) {
    // Spacesuit
    group.current.position.y = -page1Progress * 4;
    group.current.rotation.y = page1Progress * Math.PI * 2;
    const s1 = 1 + page1Progress;
    group.current.scale.set(s1, s1, s1);

    // Moon phase1
    const moonMinScale = 0.8;
    const moonMaxScale = 1.2;
    const moonScale = moonMinScale + page1Progress * (moonMaxScale - moonMinScale);
    moonRef.current.scale.set(moonScale, moonScale, moonScale);
    moonRef.current.position.y = 1 - page1Progress * 2.5;

    // Text fade-ins (appear during page1)
    if (textRef1.current?.material) textRef1.current.material.opacity = Math.min(Math.max(page1Progress - 0.16, 0) * 2, 1);
    if (textRef2.current?.material) textRef2.current.material.opacity = Math.min(Math.max(page1Progress - 0.34, 0) * 2, 1);
    if (textRef3.current?.material) textRef3.current.material.opacity = Math.min(Math.max(page1Progress - 0.6, 0) * 2, 1);

    // InfoBox fade-in
    if (boxRef.current) boxRef.current.material.opacity = Math.min(page1Progress, 1) * 0.55;
  }

  // --- PHASE 2: Spacesuit top-left & shrinking ---
  if (page2Progress > 0) {
    // Spacesuit movement
    const startPos = phase1EndPos;
    const endPos = [-1.5, 2, -1];
    group.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * page2Progress;
    group.current.position.y = startPos[1] + (endPos[1] - startPos[1]) * page2Progress;
    group.current.position.z = startPos[2] + (endPos[2] - startPos[2]) * page2Progress;

    // Continuous rotation
    group.current.rotation.y += 0.01;

    // Shrink Spacesuit
    const s2 = phase1EndScale + (0.5 - phase1EndScale) * page2Progress;
    group.current.scale.set(s2, s2, s2);

    // Moon fly-away & shrink
    const moonPhase1EndY = 1 - 1 * 2.5;       
    const moonPhase1EndScale = 0.8 + 1 * (1.2 - 0.8); 
    moonRef.current.position.y = moonPhase1EndY + (4 - moonPhase1EndY) * page2Progress; 
    const moonTargetScale = moonPhase1EndScale * (1 - 0.5 * page2Progress);
    moonRef.current.scale.set(moonTargetScale, moonTargetScale, moonTargetScale);

    // InfoBox fade-out
    if (boxRef.current) boxRef.current.material.opacity = Math.max(0, 0.55 * (0 - page2Progress));

    // Text fade-out
    if (textRef1.current?.material) textRef1.current.material.opacity = Math.max(0, textRef1.current.material.opacity * (0.5 - page2Progress));
    if (textRef2.current?.material) textRef2.current.material.opacity = Math.max(0, textRef2.current.material.opacity * (0.4 - page2Progress));
    if (textRef3.current?.material) textRef3.current.material.opacity = Math.max(0, textRef3.current.material.opacity * (0.3 - page2Progress));
  }

  // --- ALWAYS rotate moon ---
  moonRef.current.rotation.y += 0.005;
  moonRef.current.rotation.z += 0.005;
});




  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* Spacesuit */}
      <group ref={group}>
        <primitive object={scene} />
      </group>

      {/* Moon */}
      <group ref={moonRef} position={[2, 1, -2]} scale={[0.8,0.8,0.8]}>
        <primitive object={moonScene} />
      </group>

      {/* Texts */}
      <Text ref={textRef1} position={[-0.6, 1.5, 0]} fontSize={0.1} color="rgb(130, 176, 179)" anchorX="center" anchorY="middle" material-transparent>
        {"👜 Software Engineer\nBengaluru, India"}
      </Text>
      <Text ref={textRef2} position={[-0.72, 1.1, 0]} fontSize={0.1} color="rgb(130, 176, 179)" anchorX="center" anchorY="middle" material-transparent>
        {"👷‍♂️ Devian\nFounder, CTO"}
      </Text>
      <Text ref={textRef3} position={[0.05, 0.7, 0]} fontSize={0.1} color="rgb(130, 176, 179)" anchorX="center" anchorY="middle" material-transparent>
        {"👽 This site is currently being built,\nsome things might be broken"}
      </Text>

      <InfoBox />
    </>
  );
}

// Preload models
useGLTF.preload("/models/sapcesuit1.glb");
useGLTF.preload("/models/moon2.glb");
