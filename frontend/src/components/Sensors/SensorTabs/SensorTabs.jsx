import "./SensorTabs.css";

import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";

import { useMemo } from "react";

import { useSensor } from "../../../context/SensorContext";
import { useSimulation } from "../../../context/SimulationContext";


// =====================================================
// SENSOR CONFIGURATION
// =====================================================

const SENSOR_CONFIG = {
  "RGB-D Camera": {
    position: [0, 0.48, -0.70],
    rotation: [0, 0, 0],
  },

  "Stereo Camera": {
    position: [0, 0.35, -0.58],
    rotation: [0, 0, 0],
  },

  "Thermal Camera": {
    position: [0, 0.05, 0.90],
    rotation: [0, Math.PI, 0],
  },

  "LiDAR": {
    position: [0, 0, -1.15],
    rotation: [0, 0, 0],
  },
};


// =====================================================
// TARGET MODEL
// =====================================================

function MiniTarget({ sensor }) {

  const { scene } = useGLTF(
    "/models/satellite.glb"
  );

  const target = useMemo(() => {

    const clone = scene.clone(true);

    clone.traverse((child) => {

      if (!child.isMesh) return;

      if (child.material) {

        child.material =
          child.material.clone();

        if (sensor === "Thermal Camera") {

          child.material.color.set(
            "#b85c32"
          );

          child.material.emissive.set(
            "#5c2415"
          );

          child.material.emissiveIntensity =
            0.6;
        }
      }
    });

    return clone;

  }, [scene, sensor]);


  return (
    <primitive
      object={target}
      scale={0.12}
    />
  );
}


// =====================================================
// SENSOR CAMERA SCENE
// =====================================================

function MiniSensorScene({ sensor }) {

  const {
    chaserPosition,
    targetPosition,
  } = useSimulation();


  // ===================================================
  // CHASER ORBIT
  // ===================================================

  const ORBIT_X = 4.8;
  const ORBIT_Z = 5.5;


  // ===================================================
  // CHASER ROTATION
  // ===================================================

  const chaserAngle = Math.atan2(
    chaserPosition.z / ORBIT_Z,
    chaserPosition.x / ORBIT_X
  );

  const chaserYaw =
    chaserAngle + Math.PI / 2;


  // ===================================================
  // SENSOR CONFIG
  // ===================================================

  const config =
    SENSOR_CONFIG[sensor];


  const [
    sensorX,
    sensorY,
    sensorZ,
  ] = config.position;


  // ===================================================
  // SENSOR WORLD POSITION
  // ===================================================

  const cos =
    Math.cos(chaserYaw);

  const sin =
    Math.sin(chaserYaw);


  const sensorWorldX =
    chaserPosition.x +
    cos * sensorX +
    sin * sensorZ;


  const sensorWorldY =
    chaserPosition.y +
    sensorY;


  const sensorWorldZ =
    chaserPosition.z -
    sin * sensorX +
    cos * sensorZ;


  // ===================================================
  // TARGET VECTOR
  // ===================================================

  const dx =
    targetPosition.x -
    sensorWorldX;

  const dy =
    targetPosition.y -
    sensorWorldY;

  const dz =
    targetPosition.z -
    sensorWorldZ;


  // ===================================================
  // WORLD → CHASER LOCAL
  // ===================================================

  const localX =
    cos * dx -
    sin * dz;

  const localY =
    dy;

  const localZ =
    sin * dx +
    cos * dz;


  // ===================================================
  // SENSOR LOCAL COORDINATE
  // ===================================================

  const relativeX =
    localX;

  const relativeY =
    localY;

  const relativeZ =
    localZ;


  return (
    <>

      {/* ============================================= */}
      {/* SENSOR CAMERA */}
      {/* ============================================= */}

      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}
        rotation={
          config.rotation
        }
        fov={60}
        near={0.1}
        far={100}
      />


      {/* ============================================= */}
      {/* LIGHTING */}
      {/* ============================================= */}

      <ambientLight
        intensity={
          sensor === "Thermal Camera"
            ? 1.0
            : 1.5
        }
      />

      <directionalLight
        position={[
          3,
          4,
          5
        ]}
        intensity={3}
      />


      {/* ============================================= */}
      {/* TARGET */}
      {/* ============================================= */}

      <group
        position={[
          relativeX,
          relativeY,
          relativeZ
        ]}
      >

        <MiniTarget
          sensor={sensor}
        />

      </group>

    </>
  );
}


// =====================================================
// MINI SENSOR PREVIEW
// =====================================================

function MiniSensorPreview({ sensor }) {

  return (
    <div className="mini-sensor-preview">

      <Canvas
        camera={{
          position: [0, 0, 0],
          fov: 60,
          near: 0.1,
          far: 100,
        }}
      >

        <MiniSensorScene
          sensor={sensor}
        />

      </Canvas>

    </div>
  );
}


// =====================================================
// SENSOR TABS
// =====================================================

function SensorTabs({ sensorData }) {

  const {
    selectedSensor,
    setSelectedSensor,
  } = useSensor();


  const sensors = [
    {
      name: "RGB-D Camera",
      key: "rgbd",
    },

    {
      name: "Stereo Camera",
      key: "stereo",
    },

    {
      name: "Thermal Camera",
      key: "thermal",
    },

    {
      name: "LiDAR",
      key: "lidar",
    },
  ];


  return (
    <div className="sensor-tabs">

      {sensors.map((sensor) => {

        const isSelected =
          selectedSensor === sensor.name;


        const data =
          sensorData?.[sensor.key];


        return (
          <button
            key={sensor.name}
            className={`sensor-card ${
              isSelected
                ? "selected"
                : ""
            }`}
            onClick={() =>
              setSelectedSensor(
                sensor.name
              )
            }
          >

            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}

            <div className="sensor-card-header">

              <h3>
                {sensor.name}
              </h3>


              <span className="sensor-status">

                <span className="status-dot">
                </span>

                {data?.status
                  ? data.status.toUpperCase()
                  : "CONNECTING..."}

              </span>

            </div>


            {/* ===================================== */}
            {/* SENSOR POV */}
            {/* ===================================== */}

            <MiniSensorPreview
              sensor={sensor.name}
            />

          </button>
        );
      })}

    </div>
  );
}


// =====================================================
// PRELOAD
// =====================================================

useGLTF.preload(
  "/models/satellite.glb"
);


export default SensorTabs;