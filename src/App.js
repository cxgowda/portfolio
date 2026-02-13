import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Loader from "./loader";
import Cephi from "./Cephi";
import { Suspense, useEffect, useState } from "react";

function MainPage() {
  const [showArrow, setShowArrow] = useState(true);

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
      <div className="hero-text">
        <Logo />
      </div>

      <div className={`scroll-arrow ${!showArrow ? "hide" : ""}`}>
        <div className="chevron"><span></span><span></span></div>
        <div className="chevron"><span></span><span></span></div>
        <div className="chevron"><span></span><span></span></div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={<Loader />}>
          <ScrollControls pages={1} damping={0.0}>
            <Scene />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cephi" element={<Cephi />} />
      </Routes>
    </Router>
  );
}
