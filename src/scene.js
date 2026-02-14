import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, useGLTF, useAnimations, Text } from "@react-three/drei";
import { useRef, useEffect } from "react";
import InfoBox from "./InfoBox";
import CephiLoader from "./CephiLoader.js";

export default function Scene() {
  const group = useRef();
  const moonRef = useRef();
  const scroll = useScroll();
  const boxRef = useRef();
  const loaderRef = useRef();

  const textRef1 = useRef();
  const textRef2 = useRef();
  const textRef3 = useRef();

  const { viewport } = useThree(); // for responsive sizing

  // Determine mobile vs desktop
  const isMobile = viewport.width < 3.2; // tweak threshold if needed
  const loaderWidth = isMobile ? viewport.width * 0.95 : viewport.width * 0.95;
  const loaderHeight = isMobile ? viewport.height * 0.20 : viewport.height * 0.60;

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
    const page1Progress = Math.min(offset / pageLength, 1);
    const page2Progress =
      offset >= pageLength
        ? Math.min((offset - pageLength) / pageLength, 1)
        : 0;

    // --- PHASE 1: Spacesuit center animation ---
    const phase1EndPos = [0, -4, 0];
    const phase1EndScale = 2;

    if (page1Progress > 0) {
      // Spacesuit
      group.current.position.y = -page1Progress * 4;
      group.current.rotation.y = page1Progress * Math.PI * 2;
      const s1 = 1 + page1Progress;
      group.current.scale.set(s1, s1, s1);

      // Moon phase1
      const moonMinScale = 0.8;
      const moonMaxScale = 1.2;
      const moonScale =
        moonMinScale + page1Progress * (moonMaxScale - moonMinScale);
      moonRef.current.scale.set(moonScale, moonScale, moonScale);
      moonRef.current.position.y = 1 - page1Progress * 2.5;

      // Text fade-ins
      if (textRef1.current?.material)
        textRef1.current.material.opacity = Math.min(
          Math.max(page1Progress - 0.16, 0) * 2,
          1
        );
      if (textRef2.current?.material)
        textRef2.current.material.opacity = Math.min(
          Math.max(page1Progress - 0.34, 0) * 2,
          1
        );
      if (textRef3.current?.material)
        textRef3.current.material.opacity = Math.min(
          Math.max(page1Progress - 0.6, 0) * 2,
          1
        );

      // InfoBox fade-in
      if (boxRef.current && boxRef.current.material)
        boxRef.current.material.opacity = Math.min(page1Progress, 1) * 0.55;
    }

    // --- PHASE 2: Spacesuit top-left & shrinking ---
    if (page2Progress > 0) {
      const startPos = phase1EndPos;
      const endPos = [-1.5, 2, -1];
      group.current.position.x =
        startPos[0] + (endPos[0] - startPos[0]) * page2Progress;
      group.current.position.y =
        startPos[1] + (endPos[1] - startPos[1]) * page2Progress;
      group.current.position.z =
        startPos[2] + (endPos[2] - startPos[2]) * page2Progress;

      group.current.rotation.y += 0.01;

      const s2 = phase1EndScale + (0.5 - phase1EndScale) * page2Progress;
      group.current.scale.set(s2, s2, s2);

      // Moon fly-away & shrink
      const moonPhase1EndY = 1 - 1 * 2.5;
      const moonPhase1EndScale = 0.8 + 1 * (1.2 - 0.8);
      moonRef.current.position.y =
        moonPhase1EndY + (4 - moonPhase1EndY) * page2Progress;
      const moonTargetScale =
        moonPhase1EndScale * (1 - 0.5 * page2Progress);
      moonRef.current.scale.set(
        moonTargetScale,
        moonTargetScale,
        moonTargetScale
      );

      // InfoBox fade-out
      if (boxRef.current && boxRef.current.material)
        boxRef.current.material.opacity = Math.max(
          0,
          0.55 * (1 - page2Progress)
        );

      // Text fade-out
      if (textRef1.current?.material)
        textRef1.current.material.opacity = Math.max(
          0,
          textRef1.current.material.opacity * (0.5 - page2Progress)
        );
      if (textRef2.current?.material)
        textRef2.current.material.opacity = Math.max(
          0,
          textRef2.current.material.opacity * (0.4 - page2Progress)
        );
      if (textRef3.current?.material)
        textRef3.current.material.opacity = Math.max(
          0,
          textRef3.current.material.opacity * (0.3 - page2Progress)
        );
    }

    // --- CephiLoader panel responsive ---
    if (loaderRef.current && loaderRef.current.material) {
      const page2Start = 1 / totalPages; // 0.25
      const page2End = 2 / totalPages; // 0.5
      //const page3Start = 2 / totalPages; // 0.5
      //const page3End = 3 / totalPages; // 0.75

        //const fadeInStart = 1 / totalPages;     // page2 start
  const fadeInEnd   = 2 / totalPages;     // page2 end
  const fadeOutStart = fadeInEnd;         // start fade out immediately after fade-in
  const fadeOutEnd   = fadeInEnd + 0.05;  // currently 0.05 → you can make it faster

      // progress for fade in/out
      let progressIn = (offset - page2Start) / (page2End - page2Start);
      progressIn = Math.min(Math.max(progressIn * 1.5, 0), 1);
      // Fade-out progress
  let progressOut = (offset - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  progressOut = Math.min(Math.max(progressOut, 0), 1);

      const startY = -viewport.height / 1 - 0.3;
      const midY = -viewport.height * 0.15;
      const outY = midY + viewport.height * 0.25;

      loaderRef.current.position.y =
        progressOut > 0
          ? midY + (outY - midY) * progressOut
          : startY + (midY - startY) * progressIn;

      loaderRef.current.material.opacity =
        progressOut > 0 ? 1 - progressOut : progressIn;
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
      <group ref={moonRef} position={[2, 1, -2]} scale={[0.8, 0.8, 0.8]}>
        <primitive object={moonScene} />
      </group>

      {/* Texts */}
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
      <Text
        ref={textRef3}
        position={[0.05, 0.7, 0]}
        fontSize={0.1}
        color="rgb(130, 176, 179)"
        anchorX="center"
        anchorY="middle"
        material-transparent
      >
        {"👽 This site is currently being built,\nsome things might be broken"}
      </Text>

      <InfoBox />

      {/* Responsive CephiLoader */}
      <CephiLoader
        ref={loaderRef}
        color="#222222"
        args={[loaderWidth, loaderHeight, 0.1]}
        position={[0, -viewport.height / 2 + 0.8, -1.5]}
      />
    </>
  );
}

// Preload models
useGLTF.preload("/models/sapcesuit1.glb");
useGLTF.preload("/models/moon2.glb");
