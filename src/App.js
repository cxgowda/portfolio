import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Footer from "./footer";
import Loader from "./loader";
import { Suspense } from "react";

export default function App() {
  return (
    <>
      <div className="hero-text">
        <Logo />
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Suspense shows loader while model loads */}
        <Suspense fallback={<Loader />}>
          <ScrollControls pages={1} damping={0.25}>
            <Scene />
          </ScrollControls>
        </Suspense>
      </Canvas>

      <Footer />
    </>
  );
}
