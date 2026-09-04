import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  useGLTF,
  Html,
} from "@react-three/drei";

import { useMemo, useRef } from "react";

import { useSimulation } from "../../../context/SimulationContext";

import "./SensorViewer.css";


// =====================================================
// TARGET MODEL
// =====================================================

function TargetModel({ thermal = false }) {

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

        if (thermal) {

          child.material.color.set(
            "#b85c32"
          );

          child.material.emissive.set(
            "#5c2415"
          );

          child.material.emissiveIntensity =
            0.7;
        }
      }
    });

    return clone;

  }, [scene, thermal]);

  return (
    <primitive
      object={target}
      scale={0.12}
    />
  );
}


// =====================================================
// CAMERA SCENE
// =====================================================

function CameraScene({
  sensor,
  showDetection = false,
}) {

  const targetRef = useRef(null);

  const {
    chaserPosition,
    targetPosition,
  } = useSimulation();


  // ===================================================
  // CHASER ORBIT
  // ===================================================

  const CHASER_ORBIT_X = 4.8;
  const CHASER_ORBIT_Z = 5.5;


  // ===================================================
  // CHASER ORIENTATION
  // ===================================================

  const chaserAngle =
    Math.atan2(
      chaserPosition.z / CHASER_ORBIT_Z,
      chaserPosition.x / CHASER_ORBIT_X
    );

  const chaserYaw =
    chaserAngle + Math.PI / 2;


  // ===================================================
  // SENSOR OFFSET
  // ===================================================

  let sensorX = 0;
  let sensorY = 0.48;
  let sensorZ = -0.70;


  if (sensor === "Thermal Camera") {

    sensorX = 0;
    sensorY = 0.05;
    sensorZ = 0.90;
  }


  if (sensor === "Stereo Camera") {

    sensorX = 0;
    sensorY = 0.35;
    sensorZ = -0.58;
  }


  if (sensor === "LiDAR") {

    sensorX = 0;
    sensorY = 0;
    sensorZ = -1.15;
  }


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
  // TARGET RELATIVE POSITION
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
  // SENSOR DISTANCE
  // ===================================================

  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy +
      dz * dz
    );


  // ===================================================
  // WORLD → SENSOR SPACE
  // ===================================================

  const relativeX =
    cos * dx -
    sin * dz;

  const relativeY =
    dy;

  const relativeZ =
    sin * dx +
    cos * dz;


  // ===================================================
  // TARGET UPDATE
  // ===================================================

  useFrame(() => {

    if (!targetRef.current) return;

    targetRef.current.position.set(
      relativeX,
      relativeY,
      relativeZ
    );

  });


  return (
    <>

      {/* ============================================ */}
      {/* RGB-D / SENSOR CAMERA */}
      {/* ============================================ */}

  <PerspectiveCamera
  makeDefault
  position={[
    0,
    0,
    0
  ]}
  rotation={[
    0,
    Math.PI,
    0
  ]}
  fov={60}
  near={0.1}
  far={100}
/>

      {/* ============================================ */}
      {/* LIGHTING */}
      {/* ============================================ */}

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


      {/* ============================================ */}
      {/* TARGET */}
      {/* ============================================ */}

      <group
        ref={targetRef}
        position={[
          relativeX,
          relativeY,
          relativeZ
        ]}
      >

        <TargetModel
          thermal={
            sensor === "Thermal Camera"
          }
        />


        {/* ======================================== */}
        {/* TARGET DETECTION BOX */}
        {/* ======================================== */}

        {showDetection && (
          <Html
            center
            distanceFactor={1}
            style={{
              pointerEvents: "none",
            }}
          >

            <div
              style={{
                width: "145px",
                height: "85px",
                border:
                  "1px solid #60a5fa",
                position: "relative",
                boxSizing: "border-box",
              }}
            >

              <span
                style={{
                  position:
                    "absolute",
                  left: "0",
                  top: "-20px",
                  padding:
                    "3px 6px",
                  fontSize: "9px",
                  color: "#60a5fa",
                  background:
                    "#08111f",
                  border:
                    "1px solid #60a5fa",
                  whiteSpace:
                    "nowrap",
                }}
              >
                TARGET
              </span>

            </div>

          </Html>
        )}

      </group>

    </>
  );
}


// =====================================================
// SENSOR CANVAS
// =====================================================

function SensorCanvas({
  sensor,
  showDetection = false,
}) {

  return (
    <div className="sensor-camera-canvas">

      <Canvas
        camera={{
          position: [
            0,
            0,
            0
          ],
          fov: 60,
          near: 0.1,
          far: 100
        }}
      >

        <CameraScene
          sensor={sensor}
          showDetection={
            showDetection
          }
        />

      </Canvas>

    </div>
  );
}


// =====================================================
// RGB-D VIEW
// =====================================================

function RGBDView() {

  const {
    chaserPosition,
    targetPosition,
  } = useSimulation();


  // ===================================================
  // RGB-D SENSOR OFFSET
  // ===================================================

  const SENSOR_X = 0;
  const SENSOR_Y = 0.48;
  const SENSOR_Z = -0.70;


  // ===================================================
  // CHASER ANGLE
  // ===================================================

  const chaserAngle =
    Math.atan2(
      chaserPosition.z / 5.5,
      chaserPosition.x / 4.8
    );

  const chaserYaw =
    chaserAngle + Math.PI / 2;


  const cos =
    Math.cos(chaserYaw);

  const sin =
    Math.sin(chaserYaw);


  // ===================================================
  // SENSOR WORLD POSITION
  // ===================================================

  const sensorWorldX =
    chaserPosition.x +
    cos * SENSOR_X +
    sin * SENSOR_Z;


  const sensorWorldY =
    chaserPosition.y +
    SENSOR_Y;


  const sensorWorldZ =
    chaserPosition.z -
    sin * SENSOR_X +
    cos * SENSOR_Z;


  // ===================================================
  // TARGET DISTANCE
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


  const depth =
    Math.sqrt(
      dx * dx +
      dy * dy +
      dz * dz
    );


  return (
    <div className="sensor-3d-view">

      <SensorCanvas
        sensor="RGB-D Camera"
        showDetection={true}
      />


      {/* ========================================== */}
      {/* RGB */}
      {/* ========================================== */}

      <div className="sensor-overlay top-left">
        RGB
      </div>


      {/* ========================================== */}
      {/* DEPTH */}
      {/* ========================================== */}

      <div className="sensor-overlay top-right">
        DEPTH
      </div>


      {/* ========================================== */}
      {/* CROSSHAIR */}
      {/* ========================================== */}

      <div className="crosshair">
        +
      </div>


      {/* ========================================== */}
      {/* DEPTH READOUT */}
      {/* ========================================== */}

      <div className="depth-readout">

        <span>
          DEPTH
        </span>

        <strong>
          {depth.toFixed(2)} m
        </strong>

      </div>

    </div>
  );
}


// =====================================================
// STEREO VIEW
// =====================================================

function StereoView() {

  return (
    <div className="stereo-3d-view">

      <div className="stereo-camera-view">

        <span className="camera-label">
          LEFT CAMERA
        </span>

        <SensorCanvas
          sensor="Stereo Camera"
        />

      </div>


      <div className="stereo-camera-view">

        <span className="camera-label">
          RIGHT CAMERA
        </span>

        <SensorCanvas
          sensor="Stereo Camera"
        />

      </div>

    </div>
  );
}


// =====================================================
// THERMAL VIEW
// =====================================================

function ThermalView() {

  return (
    <div className="thermal-3d-view">

      <SensorCanvas
        sensor="Thermal Camera"
      />

      <div className="thermal-label">
        THERMAL
      </div>

      <div className="temperature-readout">

        <span>
          TARGET TEMP
        </span>

        <strong>
          42.6°C
        </strong>

      </div>

    </div>
  );
}


// =====================================================
// LiDAR VIEW
// =====================================================

function LiDARView() {

  return (
    <div className="lidar-3d-view">

      <SensorCanvas
        sensor="LiDAR"
      />

      <div className="lidar-label">
        LiDAR SENSOR VIEW
      </div>

      <div className="lidar-readout">

        <span>
          RANGE
        </span>

        <strong>
          --
        </strong>

      </div>

    </div>
  );
}


// =====================================================
// MAIN
// =====================================================

function SensorTargetView({
  selectedSensor
}) {

  switch (selectedSensor) {

    case "RGB-D Camera":
      return <RGBDView />;

    case "Stereo Camera":
      return <StereoView />;

    case "Thermal Camera":
      return <ThermalView />;

    case "LiDAR":
      return <LiDARView />;

    default:
      return <RGBDView />;
  }
}


// =====================================================
// PRELOAD
// =====================================================

useGLTF.preload(
  "/models/satellite.glb"
);


export default SensorTargetView;