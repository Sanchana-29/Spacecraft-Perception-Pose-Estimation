import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useSimulation } from "../../context/SimulationContext";

function TargetSpacecraft() {
  const groupRef = useRef();

  const { scene } = useGLTF("/models/satellite.glb");

  const {
    targetPosition,
    setSelectedObject,
    resetKey,
  } = useSimulation();

  const ORBIT_X = 6.2;
  const ORBIT_Z = 7.0;

  /*
   * =========================
   * FOLLOW SIMULATION STATE
   * =========================
   *
   * SimulationContext is the only
   * component responsible for movement.
   */

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.position.set(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );

    const angle = Math.atan2(
      targetPosition.z / ORBIT_Z,
      targetPosition.x / ORBIT_X
    );

    groupRef.current.rotation.set(
      0,
      angle + Math.PI / 2,
      0
    );
  }, [targetPosition]);

  /*
   * =========================
   * RESET
   * =========================
   */

  useEffect(() => {
    if (!groupRef.current) return;

    groupRef.current.position.set(
      ORBIT_X,
      0,
      0
    );

    groupRef.current.rotation.set(
      0,
      Math.PI / 2,
      0
    );
  }, [resetKey]);

  /*
   * =========================
   * TARGET SELECTION
   * =========================
   */

  const handleClick = (event) => {
    event.stopPropagation();

    setSelectedObject({
      id: "SAT-001",
      name: "Target Satellite",
      type: "Target Spacecraft",

      status: "Tracked",

      distance: "1.4 m",
      velocity: "2.31 m/s",

      position: {
        x: targetPosition.x.toFixed(1),
        y: targetPosition.y.toFixed(1),
        z: targetPosition.z.toFixed(1),
      },

      attitude: {
        roll: "2.1°",
        pitch: "4.5°",
        yaw: "18.2°",
      },

      trackingStatus: "Active",
      confidence: "96.4%",
    });
  };

  return (
    <group
      ref={groupRef}
      position={[ORBIT_X, 0, 0]}
      onClick={handleClick}
    >
      <primitive
        object={scene.clone()}
        scale={0.08}
      />
    </group>
  );
}

useGLTF.preload("/models/satellite.glb");

export default TargetSpacecraft;