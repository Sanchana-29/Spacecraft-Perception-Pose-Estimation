import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import { useSimulation } from "../../context/SimulationContext";


function TargetSpacecraft() {

  // ==========================================
  // GROUP
  // ==========================================

  const groupRef = useRef();


  // ==========================================
  // ORBIT ANGLE
  // ==========================================

  const angle = useRef(0);


  // ==========================================
  // TARGET MODEL
  // ==========================================

  const { scene } = useGLTF(
    "/models/satellite.glb"
  );


  // ==========================================
  // SIMULATION CONTEXT
  // ==========================================

  const {
    isRunning,
    simulationSpeed,
    setSelectedObject,
    resetKey,
    setTargetPosition,
  } = useSimulation();


  // ==========================================
  // TARGET ORBIT
  // ==========================================

  const ORBIT_X = 6.2;
  const ORBIT_Z = 7.0;

  const START_ANGLE = 0;


  // ==========================================
  // TARGET CLICK
  // ==========================================

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
        x: "6.2",
        y: "0.0",
        z: "0.0",
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


  // ==========================================
  // RESET
  // ==========================================

  useEffect(() => {

    if (!groupRef.current) return;


    // Reset angle

    angle.current =
      START_ANGLE;


    // Reset target model

    groupRef.current.position.set(
      ORBIT_X,
      0,
      0
    );


    // Reset context position

    setTargetPosition({

      x: ORBIT_X,
      y: 0,
      z: 0,

    });


    // Reset rotation

    groupRef.current.rotation.set(
      0,
      0,
      0
    );

  }, [
    resetKey,
    setTargetPosition
  ]);


  // ==========================================
  // ORBIT MOVEMENT
  // ==========================================

  useFrame((state, delta) => {

    if (!groupRef.current) return;


    // Pause

    if (!isRunning) return;


    // Update angle

    angle.current +=
      delta *
      0.025 *
      simulationSpeed;


    // Calculate position

    const x =
      Math.cos(angle.current) *
      ORBIT_X;

    const z =
      Math.sin(angle.current) *
      ORBIT_Z;


    // Move target

    groupRef.current.position.set(
      x,
      0,
      z
    );


    // Send world position

    setTargetPosition({

      x,
      y: 0,
      z,

    });


    // Rotate target along orbit

    groupRef.current.rotation.y =
      angle.current +
      Math.PI / 2;

  });


  // ==========================================
  // TARGET MODEL
  // ==========================================

  return (

    <group
      ref={groupRef}

      position={[
        ORBIT_X,
        0,
        0
      ]}

      onClick={handleClick}
    >

      <primitive
        object={scene.clone()}
        scale={0.08}
      />

    </group>

  );
}


// ==========================================
// PRELOAD
// ==========================================

useGLTF.preload(
  "/models/satellite.glb"
);


export default TargetSpacecraft;