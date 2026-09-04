import "./SensorViewer.css";

import { useSensor } from "../../../context/SensorContext";
import SensorTargetView from "./SensorTargetView";


function SensorViewer({ sensorData }) {
  const { selectedSensor } = useSensor();

  const sensorInfo = {
    "RGB-D Camera": {
      key: "rgbd",
      subtitle: "RGB + Depth Perception Feed",
    },

    "Stereo Camera": {
      key: "stereo",
      subtitle: "Binocular Vision Feed",
    },

    "Thermal Camera": {
      key: "thermal",
      subtitle: "Infrared Thermal Feed",
    },

    "LiDAR": {
      key: "lidar",
      subtitle: "3D Point Cloud Feed",
    },
  };

  const currentSensor =
    sensorInfo[selectedSensor] || sensorInfo["RGB-D Camera"];

  const data = sensorData?.[currentSensor.key];


  return (
    <div className="sensor-viewer">

      {/* ================= HEADER ================= */}
      <div className="viewer-header">

        <div>
          <h2>{selectedSensor}</h2>

          <span className="viewer-subtitle">
            {currentSensor.subtitle}
          </span>
        </div>

        <div className="live-status">
          <span className="status-dot"></span>
          LIVE
        </div>

      </div>


      {/* ================= LARGE SENSOR VIEW ================= */}
      <div className="viewer-content">

        <SensorTargetView
          selectedSensor={selectedSensor}
        />

      </div>


      {/* ================= SENSOR METRICS ================= */}
      <div className="sensor-metrics">

        {/* STATUS */}
        <div className="metric-item">

          <span className="metric-label">
            STATUS
          </span>

          <strong className="metric-value">
            {data?.status
              ? data.status.toUpperCase()
              : "CONNECTING..."}
          </strong>

        </div>


        {/* FPS */}
        <div className="metric-item">

          <span className="metric-label">
            FPS
          </span>

          <strong className="metric-value">
            {data?.fps !== undefined
              ? data.fps
              : "--"}
          </strong>

        </div>


        {/* RANGE */}
        <div className="metric-item">

          <span className="metric-label">
            RANGE
          </span>

          <strong className="metric-value">
            {data?.range_m !== undefined
              ? `${data.range_m} m`
              : "--"}
          </strong>

        </div>


        {/* LATENCY */}
        <div className="metric-item">

          <span className="metric-label">
            LATENCY
          </span>

          <strong className="metric-value">
            {data?.latency_ms !== undefined
              ? `${data.latency_ms} ms`
              : "--"}
          </strong>

        </div>

      </div>

    </div>
  );
}


export default SensorViewer;