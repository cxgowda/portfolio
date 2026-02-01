import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import Scene from "./scene";
import Logo from "./logo";
import Footer from "./footer";


export default function App() {
  return (
       <>
      {/* TEXT OVERLAY */}
      
      <div className="hero-text">
  <Logo />
</div>

    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      {/* 3 pages = deeper scroll */}
      <ScrollControls pages={1} damping={0.25}>
        <Scene />
      </ScrollControls>
      
    </Canvas>
    
    <Footer />
     
     </>
  );
}
