import { useEffect, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useSimulation } from "../../context/SimulationContext";

function ServicerSpacecraft() {

  const spacecraftRef = useRef();

  const {
    chaserPosition,
    setSelectedObject,
    resetKey,
  } = useSimulation();

  const ORBIT_X = 4.8;
  const ORBIT_Z = 5.5;

  const handleClick = (event) => {

    event.stopPropagation();

    setSelectedObject({
      id: "CHS-001",
      name: "Chaser",
      type: "Servicer Spacecraft",

      status: "Active",

      distance: "125.4 m",
      velocity: "2.31 m/s",

      position: {
        x: chaserPosition.x.toFixed(1),
        y: chaserPosition.y.toFixed(1),
        z: chaserPosition.z.toFixed(1),
      },

      attitude: {
        roll: "0.0°",
        pitch: "0.0°",
        yaw: "18.2°",
      },

      trackingStatus: "Active",
      confidence: "98.2%",
    });
  };

  /*
   * Reset spacecraft transform.
   */
  useEffect(() => {

    if (!spacecraftRef.current) return;

    spacecraftRef.current.position.set(
      ORBIT_X,
      0,
      0
    );

    spacecraftRef.current.rotation.set(
      0,
      0,
      0
    );

  }, [resetKey]);


  /*
   * Update Chaser's 3D position
   * from SimulationContext.
   *
   * IMPORTANT:
   * No orbit calculation here.
   * SimulationContext is responsible
   * for simulation movement.
   */
  useEffect(() => {

    if (!spacecraftRef.current) return;

    spacecraftRef.current.position.set(
      chaserPosition.x,
      chaserPosition.y,
      chaserPosition.z
    );

    /*
     * Calculate orbit angle.
     * This is only used for spacecraft
     * orientation.
     */
    const angle = Math.atan2(
      chaserPosition.z / ORBIT_Z,
      chaserPosition.x / ORBIT_X
    );

    spacecraftRef.current.rotation.y =
      angle + Math.PI / 2;

  }, [chaserPosition]);


  return (

    <group
      ref={spacecraftRef}
      position={[
        ORBIT_X,
        0,
        0
      ]}
      scale={0.25}
      onClick={handleClick}
    >

      {/* ========================= */}
      {/* SPACECRAFT MAIN BODY */}
      {/* ========================= */}

      <mesh>

        <boxGeometry
          args={[
            1.5,
            0.8,
            2.2
          ]}
        />

        <meshStandardMaterial
          color="#b8c1cc"
          metalness={0.7}
          roughness={0.35}
        />

      </mesh>


      {/* ========================= */}
      {/* LEFT SOLAR PANEL */}
      {/* ========================= */}

      <mesh
        position={[
          -1.25,
          0,
          0
        ]}
      >

        <boxGeometry
          args={[
            1.0,
            0.08,
            1.8
          ]}
        />

        <meshStandardMaterial
          color="#183b73"
          metalness={0.4}
          roughness={0.35}
        />

      </mesh>


      {/* ========================= */}
      {/* RIGHT SOLAR PANEL */}
      {/* ========================= */}

      <mesh
        position={[
          1.25,
          0,
          0
        ]}
      >

        <boxGeometry
          args={[
            1.0,
            0.08,
            1.8
          ]}
        />

        <meshStandardMaterial
          color="#183b73"
          metalness={0.4}
          roughness={0.35}
        />

      </mesh>


      {/* ========================= */}
      {/* RGB-D CAMERA */}
      {/* ========================= */}

      <mesh
        position={[
          0,
          0.48,
          -0.58
        ]}
      >

        <boxGeometry
          args={[
            0.28,
            0.16,
            0.18
          ]}
        />

        <meshStandardMaterial
          color="#202a38"
          metalness={0.6}
          roughness={0.25}
        />

      </mesh>


      {/* RGB-D LENS */}
      
      <mesh
        position={[
          0,
          0.48,
          -0.69
        ]}
      >

        <cylinderGeometry
          args={[
            0.065,
            0.065,
            0.04,
            24
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0
          ]}
        />

        <meshStandardMaterial
          color="#101820"
          metalness={0.8}
          roughness={0.15}
        />

      </mesh>


      {/* ========================= */}
      {/* LEFT STEREO CAMERA */}
      {/* ========================= */}

      <mesh
        position={[
          -0.28,
          0.35,
          -0.58
        ]}
      >

        <boxGeometry
          args={[
            0.16,
            0.14,
            0.16
          ]}
        />

        <meshStandardMaterial
          color="#263344"
          metalness={0.6}
          roughness={0.25}
        />

      </mesh>


      {/* ========================= */}
      {/* RIGHT STEREO CAMERA */}
      {/* ========================= */}

      <mesh
        position={[
          0.28,
          0.35,
          -0.58
        ]}
      >

        <boxGeometry
          args={[
            0.16,
            0.14,
            0.16
          ]}
        />

        <meshStandardMaterial
          color="#263344"
          metalness={0.6}
          roughness={0.25}
        />

      </mesh>


      {/* ========================= */}
      {/* LiDAR */}
      {/* ========================= */}

      <mesh
        position={[
          0,
          0,
          -1.15
        ]}
      >

        <cylinderGeometry
          args={[
            0.18,
            0.18,
            0.16,
            24
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0
          ]}
        />

        <meshStandardMaterial
          color="#374151"
          metalness={0.8}
          roughness={0.2}
        />

      </mesh>


      {/* ========================= */}
      {/* THERMAL CAMERA */}
      {/* ========================= */}

      <mesh
        position={[
          0,
          0.05,
          0.9
        ]}
      >

        <boxGeometry
          args={[
            0.28,
            0.2,
            0.18
          ]}
        />

        <meshStandardMaterial
          color="#3b2a25"
          metalness={0.5}
          roughness={0.3}
        />

      </mesh>


      {/* ========================= */}
      {/* THRUSTER */}
      {/* ========================= */}

      <mesh
        position={[
          0,
          0,
          1.18
        ]}
      >

        <cylinderGeometry
          args={[
            0.22,
            0.28,
            0.25,
            24
          ]}
          rotation={[
            Math.PI / 2,
            0,
            0
          ]}
        />

        <meshStandardMaterial
          color="#697586"
          metalness={0.75}
          roughness={0.3}
        />

      </mesh>


      {/* ========================= */}
      {/* RGB-D CAMERA POV */}
      {/* ========================= */}

      <PerspectiveCamera
        makeDefault={false}
        position={[
          0,
          0.48,
          -0.70
        ]}
        rotation={[
          0,
          0,
          0
        ]}
        fov={60}
        near={0.1}
        far={100}
      />

    </group>
  );
}

export default ServicerSpacecraft;