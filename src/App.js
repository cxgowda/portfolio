import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Footer from "./footer";
import Loader from "./loader";
import { Suspense, useEffect, useState } from "react";

export default function App() {

  // Arrow visible initially
  const [showArrow, setShowArrow] = useState(true);

  // Hide arrow on first scroll interaction
  useEffect(() => {
    const hideArrow = () => setShowArrow(false);

    window.addEventListener("wheel", hideArrow);
    window.addEventListener("touchstart", hideArrow);

    return () => {
      window.removeEventListener("wheel", hideArrow);
      window.removeEventListener("touchstart", hideArrow);
    };
  }, []);

  return (
    <>
      {/* Logo */}
      <div className="hero-text">
        <Logo />
      </div>

      {/* Scroll Hint */}
      <div className={`scroll-arrow ${!showArrow ? "hide" : ""}`}>
        <div className="chevron"><span></span><span></span></div>
        <div className="chevron"><span></span><span></span></div>
        <div className="chevron"><span></span><span></span></div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={<Loader />}>
          <ScrollControls pages={1} damping={0.25}>
            <Scene />
          </ScrollControls>
        </Suspense>
      </Canvas>

    </>
  );
}
