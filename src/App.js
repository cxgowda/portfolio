import { Canvas } from "@react-three/fiber";
import { ScrollControls, useProgress } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Footer from "./footer";
import Loader from "./loader";
import { Suspense, useEffect, useState } from "react";

/* -------------------------------- */
/* Helper Component for Arrow Logic */
/* -------------------------------- */
function ScrollArrow() {
  const { progress } = useProgress();     // loading %
  const [showArrow, setShowArrow] = useState(false);

  // Show arrow only after loading finished
  useEffect(() => {
    if (progress === 100) {
      setShowArrow(true);
    }
  }, [progress]);

  // Hide arrow on first scroll
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
    <div className={`scroll-arrow ${!showArrow ? "hide" : ""}`}>
      <div className="chevron"><span></span><span></span></div>
      <div className="chevron"><span></span><span></span></div>
      <div className="chevron"><span></span><span></span></div>
    </div>
  );
}

/* ---------------- */
/* Main App */
/* ---------------- */

export default function App() {
  return (
    <>
      {/* Logo */}
      <div className="hero-text">
        <Logo />
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />

      {/* Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
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
