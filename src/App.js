import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      {/* 3 pages = deeper scroll */}
      <ScrollControls pages={3} damping={0.25}>
        <Scene />
      </ScrollControls>
    </Canvas>
  );
}
