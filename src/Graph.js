import { useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

export default function Graph({ position }) {
  const { viewport } = useThree();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/cxgowda/cephi_data/main/metrics_data.json"
    )
      .then((res) => res.json())
      .then((data) => setPoints(data.points))
      .catch((err) => console.error(err));
  }, []);

  /* -------------------- RESPONSIVE SCALE -------------------- */

  const graphWidth = viewport.width * 0.8;      // 80% of screen width
  const graphHeight = viewport.height * 0.35;   // 35% of screen height

  const xSpacing = graphWidth / (points.length || 1);
  const yScale = graphHeight / 100; // adjust depending on your max values

  /* -------------------- LINES -------------------- */

  const lineA = useMemo(() => {
    if (!points.length) return null;

    const pts = points.map((p, i) =>
      new THREE.Vector3(i * xSpacing, p.A * yScale, 0)
    );

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points, xSpacing, yScale]);

  const lineB = useMemo(() => {
    if (!points.length) return null;

    const pts = points.map((p, i) =>
      new THREE.Vector3(i * xSpacing, p.B * yScale, 0)
    );

    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [points, xSpacing, yScale]);

  /* -------------------- AXES -------------------- */

  const xAxis = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(graphWidth, 0, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [graphWidth]);

  const yAxis = useMemo(() => {
    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, graphHeight, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [graphHeight]);

  if (!points.length) return null;

  return (
    <group position={position}>
      {/* X Axis */}
      <line geometry={xAxis}>
        <lineBasicMaterial color="white" />
      </line>

      {/* Y Axis */}
      <line geometry={yAxis}>
        <lineBasicMaterial color="white" />
      </line>

      {/* Line A */}
      <line geometry={lineA}>
        <lineBasicMaterial color="cyan" />
      </line>

      {/* Line B */}
      <line geometry={lineB}>
        <lineBasicMaterial color="hotpink" />
      </line>

      {/* Axis Labels */}
      <Text
        position={[graphWidth + 0.2, -0.2, 0]}
        fontSize={viewport.width * 0.03}
        anchorX="left"
      >
        X
      </Text>

      <Text
        position={[-0.3, graphHeight + 0.2, 0]}
        fontSize={viewport.width * 0.03}
        anchorX="center"
      >
        Y
      </Text>
    </group>
  );
}
