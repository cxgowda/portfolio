import { RoundedBox } from "@react-three/drei";
import { forwardRef, useRef, useImperativeHandle } from "react";

const CephiLoader = forwardRef(
  ({ color = "#222222", args = [2, 0.8, 0.1] }, ref) => {
    const meshRef = useRef();

    // Expose both position and material to parent
    useImperativeHandle(ref, () => ({
      position: meshRef.current.parent.position, // the group
      material: meshRef.current.material,       // the mesh material
    }));

    return (
      <group>
        <RoundedBox ref={meshRef} args={args} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={color}
            roughness={0.5}
            metalness={0}
            transparent
            opacity={0} // start invisible
          />
        </RoundedBox>
      </group>
    );
  }
);

export default CephiLoader;
