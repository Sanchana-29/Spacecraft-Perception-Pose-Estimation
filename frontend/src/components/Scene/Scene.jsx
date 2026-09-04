import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import TargetSpacecraft from "../Spacecraft/TargetSpacecraft";
import ServicerSpacecraft from "../Spacecraft/ServicerSpacecraft";

import Earth from "./Earth";
import StarsField from "./StarsField";
import SunLight from "./SunLight";
import OrbitPath from "./OrbitPath";

import { useSimulation } from "../../context/SimulationContext";

function Scene() {
  const { selectedObject } = useSimulation();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        camera={{
          position: [0, 3, 11],
          fov: 45,
        }}
      >
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
            radiusX={4.8}
            radiusZ={5.5}
            y={0}
          />
        )}

        {/* =========================
            TARGET ORBIT
        ========================= */}

        {selectedObject?.id === "SAT-001" && (
          <OrbitPath
            radiusX={6.2}
            radiusZ={7.0}
            y={0}
          />
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
          enablePan={false}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}

export default Scene;