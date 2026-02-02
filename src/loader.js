import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={styles.wrapper}>
        <p style={styles.text}>
          {Math.round(progress)}%
        </p>

        {/* BAR BACKGROUND */}
        <div style={styles.barBackground}>
          {/* BAR FILL */}
          <div
            style={{
              ...styles.barFill,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </Html>
  );
}

const styles = {
  wrapper: {
    width: "220px",
    textAlign: "center",
    fontFamily: "Orbitron, sans-serif",
  },

  text: {
    color: "#ffffff",
    fontSize: "10px",
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  barBackground: {
    width: "100%",
    height: "2px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,150,255,0.4)",
  },

  barFill: {
    height: "2px",
    background:
      "linear-gradient(90deg, #00eaff, #536972, #b6d1d6)",
    borderRadius: "20px",
    boxShadow: `
      0 0 10px #00eaff,
      0 0 20px #6a5cff,
      0 0 30px #ffffff
    `,
    transition: "width 0.3s ease",
  },
};
