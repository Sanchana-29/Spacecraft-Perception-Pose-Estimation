import "./SensorTabs.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSensor } from "../../../context/SensorContext";
import SensorSceneWorld from "../SensorViewer/SensorSceneWorld";

function MiniCanvas({ sensor, subType = null }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {!loaded && (
        <div className="mini-preview-fallback">
          <span className="preview-optics">INITIALIZING...</span>
        </div>
      )}
      <Canvas
        dpr={1}
        camera={{ fov: 60, near: 0.1, far: 300 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
        onCreated={() => setLoaded(true)}
      >
        <SensorSceneWorld sensor={sensor} subType={subType} isMini={true} />
      </Canvas>
    </div>
  );
}

/**
 * 3D Mini Sensor Preview Box Component (Uses continuous 3D visual feeds)
 */
function MiniSensorPreview({ sensor, isSelected }) {
  if (sensor === "Stereo Camera") {
    return (
      <div className={`mini-sensor-preview mini-stereo-preview ${isSelected ? "active" : ""}`}>
        <div className="mini-stereo-half">
          <span className="mini-stereo-tag">LEFT</span>
          <MiniCanvas sensor="Stereo Camera" subType="Stereo Left" />
        </div>

        <div className="mini-stereo-divider" />

        <div className="mini-stereo-half">
          <span className="mini-stereo-tag">RIGHT</span>
          <MiniCanvas sensor="Stereo Camera" subType="Stereo Right" />
        </div>
      </div>
    );
  }

  const specLabels = {
    "RGB-D Camera": "RGB + DEPTH POV",
    "Thermal Camera": "IR THERMAL POV",
    LiDAR: "3D POINT CLOUD",
  };

  const tagLabel = specLabels[sensor] || "SENSOR POV";

  return (
    <div className={`mini-sensor-preview ${isSelected ? "active" : ""}`}>
      <div className="mini-img-container">
        <MiniCanvas sensor={sensor} />
        <span className="mini-img-tag">{tagLabel}</span>
      </div>
    </div>
  );
}

/**
 * Sensor Tabs Cards Grid
 */
function SensorTabs({ sensorData }) {
  const { selectedSensor, setSelectedSensor } = useSensor();

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
        const isSelected = selectedSensor === sensor.name;
        const data = sensorData?.[sensor.key];

        return (
          <button
            key={sensor.name}
            className={`sensor-card ${isSelected ? "selected" : ""}`}
            onClick={() => setSelectedSensor(sensor.name)}
          >
            {/* HEADER */}
            <div className="sensor-card-header">
              <h3>{sensor.name}</h3>

              <span className="sensor-status">
                <span className="status-dot" />
                {data?.status ? data.status.toUpperCase() : "ACTIVE"}
              </span>
            </div>

            {/* HIGH-TECH PREVIEW */}
            <MiniSensorPreview sensor={sensor.name} isSelected={isSelected} />
          </button>
        );
      })}
    </div>
  );
}

export default SensorTabs;