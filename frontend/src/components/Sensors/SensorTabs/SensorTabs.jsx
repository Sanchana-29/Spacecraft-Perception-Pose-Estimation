import "./SensorTabs.css";
import { Canvas } from "@react-three/fiber";
import { useSensor } from "../../../context/SensorContext";
import SensorSceneWorld from "../SensorViewer/SensorSceneWorld";

/**
 * Mini Sensor Preview Card
 */
function MiniSensorPreview({ sensor }) {
  return (
    <div className="mini-sensor-preview">
      <Canvas
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "low-power",
        }}
      >
        <SensorSceneWorld
          sensor={sensor}
          subType={sensor === "Stereo Camera" ? "Stereo Left" : null}
        />
      </Canvas>
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
                {data?.status ? data.status.toUpperCase() : "LIVE"}
              </span>
            </div>

            {/* LIVE SENSOR POV */}
            <MiniSensorPreview sensor={sensor.name} />
          </button>
        );
      })}
    </div>
  );
}

export default SensorTabs;