import { useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export default function Graph({ position = [0, 0, 0] }) {
  const { viewport } = useThree();
  const [points, setPoints] = useState([]);

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/cxgowda/cephi_data/main/metrics_data.json"
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPoints(data);
        else if (Array.isArray(data.points)) setPoints(data.points);
        else setPoints([]);
      })
      .catch(() => setPoints([]));
  }, []);

  /* -------------------- GLASS PANEL SIZE -------------------- */

  const panelWidth = Math.min(viewport.width * 0.9, 6);
  const panelHeight = Math.min(viewport.height * 0.6, 4);

  const graphWidth = panelWidth * 0.85;
  const graphHeight = panelHeight * 0.65;

  const xSpacing = graphWidth / Math.max(points.length - 1, 1);
  const maxVolume = Math.max(...points.map(p => p?.Volume || 0), 1);
  const yScale = graphHeight / maxVolume;

  /* -------------------- GRAPH LINE -------------------- */

  const lineGeometry = useMemo(() => {
    if (!points.length) return null;

    const pts = points.map((p, i) =>
      new THREE.Vector3(
        -graphWidth / 2 + i * xSpacing,   // center horizontally
        -graphHeight / 2 + (p?.Volume || 0) * yScale, // center vertically
        0.05
      )
    );

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points, xSpacing, yScale, graphWidth, graphHeight]);

  const xAxis = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-graphWidth / 2, -graphHeight / 2, 0.05),
      new THREE.Vector3(graphWidth / 2, -graphHeight / 2, 0.05),
    ]);
  }, [graphWidth, graphHeight]);

  const yAxis = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-graphWidth / 2, -graphHeight / 2, 0.05),
      new THREE.Vector3(-graphWidth / 2, graphHeight / 2, 0.05),
    ]);
  }, [graphWidth, graphHeight]);

  if (!points.length || !lineGeometry) return null;

  /* -------------------- RENDER -------------------- */

  return (
    <group position={position}>
      
      {/* Glass Panel */}
      <RoundedBox args={[panelWidth, panelHeight, 0.2]} radius={0.2}>
        <meshPhysicalMaterial
          transparent
          transmission={1}
          thickness={1}
          roughness={0.05}
          metalness={0.2}
          ior={1.5}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.02}
          color="#2a2b2c"
          opacity={0.4}
          envMapIntensity={2}
        />
      </RoundedBox>

      {/* X Axis */}
      <line geometry={xAxis}>
        <lineBasicMaterial color="white" />
      </line>

      {/* Y Axis */}
      <line geometry={yAxis}>
        <lineBasicMaterial color="white" />
      </line>

      {/* Volume Line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="cyan" />
      </line>

      {/* Labels */}
      <Text
        position={[graphWidth / 2 + 0.3, -graphHeight / 2 - 0.1, 0.1]}
        fontSize={panelWidth * 0.04}
        anchorX="left"
      >
        
      </Text>

      <Text
        position={[-graphWidth / 5 - 0.3, graphHeight / 1.8 + 0.2, 0.1]}
        fontSize={panelWidth * 0.03}
        anchorX="center"
      >
        Processed Transactions
      </Text>
      <Text
  position={[0, -panelHeight / 2 - 0.3, 0.1]} // slightly below the graph
  fontSize={panelWidth * 0.02}
  anchorX="center"
  anchorY="top"
  color="lightgrey"
>
  The chart above represent daily transaction activity measured across the network.
</Text>

  <Text
  position={[0, -panelHeight / 2 - 0.6, 0.1]} // slightly below the graph
  fontSize={panelWidth * 0.03}
  anchorX="center"
  anchorY="top"
  color="lightgrey"
  maxWidth={panelWidth * 0.85} // wrap text within this width
>
  I will be adding the full architecture of Cephi soon, including all the necessary APIs to connect and interact with the network, as well as instructions for running your own validator nodes. Since Cephi is still in the testing phase and I am currently focused on other projects, this update might take some time. However, once implemented, it will allow anyone to fully participate in the network, explore the blockchain internals, and experiment with their own validator setup.
</Text>

    </group>
  );
}
