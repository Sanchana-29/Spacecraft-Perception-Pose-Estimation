import { Canvas } from "@react-three/fiber";
import { useSimulation } from "../../../context/SimulationContext";
import SensorSceneWorld from "./SensorSceneWorld";
import { getSensorToTargetDistance } from "./sensorConstants";
import "./SensorViewer.css";

/**
 * Sensor Canvas Container
 */
function SensorCanvas({
  sensor,
  subType = null,
  canvasId = "sensor-canvas",
  onGlReady = null,
}) {
  return (
    <div className="sensor-camera-canvas" id={canvasId}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <SensorSceneWorld
          sensor={sensor}
          subType={subType}
          onGlReady={onGlReady}
        />
      </Canvas>
    </div>
  );
}

/**
 * RGB-D Visual & Depth View
 */
function RGBDView({ onGlReady }) {
  const { chaserPosition, targetPosition } = useSimulation();
  const depth = getSensorToTargetDistance(chaserPosition, targetPosition, "RGB-D Camera");

  return (
    <div className="sensor-3d-view">
      <SensorCanvas
        sensor="RGB-D Camera"
        canvasId="sensor-main-canvas"
        onGlReady={onGlReady}
      />

      <div className="sensor-overlay top-left">RGB-D FEED</div>
      <div className="sensor-overlay top-right">DEPTH SENSOR ACTIVE</div>
      <div className="crosshair">+</div>

      <div className="depth-readout">
        <span>ESTIMATED DEPTH</span>
        <strong>{depth.toFixed(2)} m</strong>
      </div>
    </div>
  );
}

/**
 * Stereo Binocular View (Left and Right)
 */
function StereoView({ onGlReady }) {
  const { chaserPosition, targetPosition } = useSimulation();
  const distance = getSensorToTargetDistance(chaserPosition, targetPosition, "Stereo Camera");

  return (
    <div className="stereo-3d-view">
      <div className="stereo-camera-view">
        <span className="camera-label">LEFT STEREO CAMERA</span>
        <SensorCanvas
          sensor="Stereo Camera"
          subType="Stereo Left"
          canvasId="sensor-main-canvas"
          onGlReady={onGlReady}
        />
      </div>

      <div className="stereo-camera-view">
        <span className="camera-label">RIGHT STEREO CAMERA</span>
        <SensorCanvas
          sensor="Stereo Camera"
          subType="Stereo Right"
          canvasId="sensor-stereo-right-canvas"
        />
      </div>

      <div className="depth-readout">
        <span>BINOCULAR RANGE</span>
        <strong>{distance.toFixed(2)} m</strong>
      </div>
    </div>
  );
}

/**
 * Thermal Infrared View
 */
function ThermalView({ onGlReady }) {
  const { chaserPosition, targetPosition } = useSimulation();
  const distance = getSensorToTargetDistance(chaserPosition, targetPosition, "Thermal Camera");

  return (
    <div className="thermal-3d-view">
      <SensorCanvas
        sensor="Thermal Camera"
        canvasId="sensor-main-canvas"
        onGlReady={onGlReady}
      />

      <div className="thermal-label">IR THERMAL IMAGING</div>

      <div className="temperature-readout">
        <span>ESTIMATED RANGE</span>
        <strong>{distance.toFixed(2)} m</strong>
      </div>
    </div>
  );
}

/**
 * LiDAR 3D Perception View
 */
function LiDARView({ onGlReady }) {
  const { chaserPosition, targetPosition } = useSimulation();
  const range = getSensorToTargetDistance(chaserPosition, targetPosition, "LiDAR");

  return (
    <div className="lidar-3d-view">
      <SensorCanvas
        sensor="LiDAR"
        canvasId="sensor-main-canvas"
        onGlReady={onGlReady}
      />

      <div className="lidar-label">LiDAR SENSOR VIEW</div>

      <div className="lidar-readout">
        <span>LiDAR RANGE</span>
        <strong>{range.toFixed(2)} m</strong>
      </div>
    </div>
  );
}

/**
 * Main Sensor Target View Selector
 */
function SensorTargetView({ selectedSensor, onGlReady }) {
  switch (selectedSensor) {
    case "RGB-D Camera":
      return <RGBDView onGlReady={onGlReady} />;
    case "Stereo Camera":
      return <StereoView onGlReady={onGlReady} />;
    case "Thermal Camera":
      return <ThermalView onGlReady={onGlReady} />;
    case "LiDAR":
      return <LiDARView onGlReady={onGlReady} />;
    default:
      return <RGBDView onGlReady={onGlReady} />;
  }
}

export default SensorTargetView;