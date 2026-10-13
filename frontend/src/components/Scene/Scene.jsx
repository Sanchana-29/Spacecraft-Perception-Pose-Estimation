import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import TargetSpacecraft from "../Spacecraft/TargetSpacecraft";
import ServicerSpacecraft from "../Spacecraft/ServicerSpacecraft";

import Earth from "./Earth";
import StarsField from "./StarsField";
import SunLight from "./SunLight";
import OrbitPath from "./OrbitPath";

import { useSimulation } from "../../context/SimulationContext";
import {
  getTargetPositionAtTime,
  ORBIT_RADIUS,
  ORBIT_OMEGA,
} from "../../utils/trajectory";

function DashboardCameraController({ controlsRef }) {
  const { chaserPosition, targetPosition } = useSimulation();

  useFrame(() => {
    if (!controlsRef.current) return;

    const targetX = (chaserPosition.x + targetPosition.x) / 2;
    const targetY = (chaserPosition.y + targetPosition.y) / 2;
    const targetZ = (chaserPosition.z + targetPosition.z) / 2;

    controlsRef.current.target.set(targetX, targetY, targetZ);
    controlsRef.current.update();
  });

  return null;
}

function ExactTargetTrajectoryPath() {
  const points = useMemo(() => {
    const pts = [];
    const steps = 300;
    const totalT = (Math.PI * 2) / ORBIT_OMEGA;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * totalT;
      pts.push(getTargetPositionAtTime(t));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#4ade80" transparent opacity={0.6} />
    </line>
  );
}

function Scene() {
  const { selectedObject } = useSimulation();
  const controlsRef = useRef();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        camera={{
          position: [5.2, 2.5, 6.5],
          fov: 45,
        }}
      >
        <DashboardCameraController controlsRef={controlsRef} />

        {/* Lighting */}
        <SunLight />

        {/* Space background */}
        <StarsField />

        {/* Earth */}
        <Earth />

        {/* =========================
            CHASER ORBIT
        ========================= */}

        {selectedObject?.id === "CHS-001" && (
          <OrbitPath
            radiusX={ORBIT_RADIUS}
            radiusZ={ORBIT_RADIUS}
            y={0}
          />
        )}

        {/* =========================
            EXACT TARGET TRAJECTORY
        ========================= */}

        {selectedObject?.id === "SAT-001" && (
          <ExactTargetTrajectoryPath />
        )}

        {/* =========================
            SPACECRAFT
        ========================= */}

        <ServicerSpacecraft />

        <TargetSpacecraft />

        {/* =========================
            CAMERA CONTROLS
        ========================= */}

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={2}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}

export default Scene;