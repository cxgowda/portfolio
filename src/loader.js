import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress(); // progress is 0 - 100

  return (
    <Html
      center
      style={{
        color: "#fff",
        fontSize: "1.5em",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading {Math.round(progress)}%
    </Html>
  );
}
