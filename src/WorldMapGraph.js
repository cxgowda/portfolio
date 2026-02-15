import { useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import worldMap from "./textures/world_map.jpg"; // globe texture

export default function DigitalSpikesGlobe({ position = [0, 0, 0] }) {
  const { viewport } = useThree();
  const globeRef = useRef(null);

  const globeRadius = Math.min(viewport.width, viewport.height) * 0.25;

  // Load globe texture
  const texture = useMemo(() => new THREE.TextureLoader().load(worldMap), []);

  // Generate random spike directions
  const spikeData = useMemo(() => {
    const spikes = [];
    const count = 200; // number of spikes
    for (let i = 0; i < count; i++) {
      const lat = Math.random() * 180 - 90; // -90 to 90
      const lon = Math.random() * 360 - 180; // -180 to 180
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);
      spikes.push({ dir: new THREE.Vector3(x, y, z), height: Math.random() * 0.1 + 0.05 });
    }
    return spikes;
  }, []);

  // Rotate globe and animate spikes
  useFrame(({ clock }) => {
    if (globeRef.current) globeRef.current.rotation.y += 0.002;

    // Animate spikes' height
    globeRef.current.children.forEach((mesh, idx) => {
      if (mesh.userData.isSpike) {
        const spike = spikeData[idx];
        const scale = Math.sin(clock.elapsedTime * 3 + idx) * 0.5 + 1;
        mesh.scale.y = spike.height * scale;
      }
    });
  });

  return (
    <group position={position}>
      {/* Globe with spikes as children */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[globeRadius, 64, 64]} />
        <meshStandardMaterial map={texture} color="#222222" />

        {/* Digital spikes attached to globe */}
        {spikeData.map((spike, idx) => {
          const pos = spike.dir.clone().multiplyScalar(globeRadius + spike.height / 2);
          const quaternion = new THREE.Quaternion();
          quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spike.dir.clone().normalize());

          return (
            <mesh
              key={idx}
              position={pos}
              quaternion={quaternion}
              userData={{ isSpike: true }}
            >
              <cylinderGeometry args={[0.01, 0.01, spike.height, 6]} />
              <meshStandardMaterial color="cyan" emissive="cyan" />
            </mesh>
          );
        })}
      </mesh>

      {/* Title */}
      <Text
        position={[0, globeRadius + 0.4, 0]}
        fontSize={globeRadius * 0.12}
        anchorX="center"
      >
      </Text>
    </group>
  );
}
