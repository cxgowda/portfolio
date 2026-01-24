import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";

export default function VideoCircle() {
  const videoRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const startVideo = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const v = videoRef.current;
      if (!v) return;

      v.muted = false;
      v.volume = 1;

      requestAnimationFrame(() => {
        v.play().catch(err => {
          console.warn("Video play blocked:", err);
        });
      });

      window.removeEventListener("pointerdown", startVideo);
      window.removeEventListener("wheel", startVideo);
      window.removeEventListener("touchstart", startVideo);
    };

    window.addEventListener("pointerdown", startVideo, { once: true });
    window.addEventListener("wheel", startVideo, { once: true });
    window.addEventListener("touchstart", startVideo, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startVideo);
      window.removeEventListener("wheel", startVideo);
      window.removeEventListener("touchstart", startVideo);
    };
  }, []);

  return (
    <Html
      center
      style={{
        position: "relative",
        bottom: "-220px",
        left: "180%",
        transform: "translateX(-50%)",
        pointerEvents: "auto",
        zIndex: 10
      }}
    >
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        loop
        playsInline
        muted
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
        }}
      />
    </Html>
  );
}
