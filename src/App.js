import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Loader from "./loader";
import Cephi from "./Cephi";
import { Suspense, useEffect, useState } from "react";

function MainPage() {
  const [showArrow, setShowArrow] = useState(true);
  const navigate = useNavigate();

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
          <ScrollControls pages={4} damping={0.0}>
            <Scene />
          </ScrollControls>
        </Suspense>
      </Canvas> 

      {/* Fixed Cephi SVG Button with sparks */}
      {/*
      <div
        style={{
          position: "fixed",
          top: "100px",
          left: "10px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => navigate("/cephi")}
          style={{
            padding: "6px",
            border: "none",
            borderRadius: "50%",
            background: "transparent",
            cursor: "pointer",
            position: "relative",
            overflow: "visible",
            boxShadow: "0 0 10px #82B0B3, 0 0 20px #82B0B3",
            animation: "glow 2s infinite alternate",
          }}
        >
          <img
            src="/icons/cephilogo.svg"
            alt="Cephi Logo"
            style={{ width: "40px", height: "40px", display: "block" }}
          />
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "4px",
                height: "4px",
                background: "#82B0B3",
                borderRadius: "50%",
                top: `${Math.random() * 100 - 20}%`,
                left: `${Math.random() * 100 - 20}%`,
                opacity: Math.random(),
                animation: `spark ${1 + Math.random() * 1.5}s infinite`,
                pointerEvents: "none",
              }}
            />
          ))}
        </button>
      </div> */}

      <style>
        {`
          @keyframes glow {
            from { box-shadow: 0 0 5px #82B0B3, 0 0 10px #82B0B3; }
            to { box-shadow: 0 0 15px #82B0B3, 0 0 30px #82B0B3; }
          }
          @keyframes spark {
            0% { transform: translate(0,0) scale(0.5); opacity: 1; }
            100% { transform: translate(calc(-20px + 40px * var(--randX)), calc(-20px + 40px * var(--randY))) scale(0); opacity: 0; }
          }
        `}
      </style> 
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
