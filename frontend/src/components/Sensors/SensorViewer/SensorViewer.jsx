import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./SensorViewer.css";

import { useSensor } from "../../../context/SensorContext";
import { useSimulation } from "../../../context/SimulationContext";
import SensorTargetView from "./SensorTargetView";
import { getSensorToTargetDistance, SENSOR_CONFIGS } from "./sensorConstants";

function SensorViewer({ sensorData }) {
  const { selectedSensor, setCapturedFrame } = useSensor();
  const { chaserPosition, targetPosition, missionTime } = useSimulation();
  const navigate = useNavigate();
  const [capturing, setCapturing] = useState(false);
  const glContextRef = useRef(null);

  const onGlReady = useCallback((context) => {
    glContextRef.current = context;
  }, []);

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
    LiDAR: {
      key: "lidar",
      subtitle: "3D Point Cloud Feed",
    },
  };

  const currentSensor =
    sensorInfo[selectedSensor] || sensorInfo["RGB-D Camera"];

  const data = sensorData?.[currentSensor.key];

  // Physically consistent distance from current sensor mount to target
  const distanceVal = getSensorToTargetDistance(
    chaserPosition,
    targetPosition,
    selectedSensor
  );

  // ==========================================
  // CAPTURE FRAME HANDLER
  // ==========================================
  const handleCaptureFrame = () => {
    setCapturing(true);

    try {
      let imageData = null;

      // 1. First attempt: Direct GL render and canvas extraction
      if (glContextRef.current) {
        const { gl, scene, camera } = glContextRef.current;
        if (gl && scene && camera) {
          gl.render(scene, camera);
          imageData = gl.domElement.toDataURL("image/png");
        }
      }

      // 2. Fallback attempt: Query DOM canvas
      if (!imageData || imageData === "data:,") {
        const canvas =
          document.querySelector("#sensor-main-canvas canvas") ||
          document.querySelector(".sensor-viewer canvas");

        if (canvas) {
          imageData = canvas.toDataURL("image/png");
        }
      }

      if (!imageData || imageData === "data:,") {
        console.error("No active sensor canvas buffer available to capture.");
        setCapturing(false);
        return;
      }

      const sensorConfig =
        SENSOR_CONFIGS[selectedSensor] || SENSOR_CONFIGS["RGB-D Camera"];

      const framePayload = {
        id: `CAP-${Date.now()}`,
        imageData,
        selectedSensor,
        sensorType: selectedSensor,
        timestamp: new Date().toISOString(),
        formattedTime: new Date().toLocaleTimeString(),
        missionTime: Number(missionTime).toFixed(1),
        chaserPosition: {
          x: Number(chaserPosition.x).toFixed(2),
          y: Number(chaserPosition.y).toFixed(2),
          z: Number(chaserPosition.z).toFixed(2),
        },
        targetPosition: {
          x: Number(targetPosition.x).toFixed(2),
          y: Number(targetPosition.y).toFixed(2),
          z: Number(targetPosition.z).toFixed(2),
        },
        fov: sensorConfig.fov || 60,
        distance: distanceVal.toFixed(2),
        range_m: distanceVal.toFixed(2),
        fps: data?.fps || 60,
      };

      setCapturedFrame(framePayload);

      // Navigate to Detection page
      navigate("/detection");
    } catch (err) {
      console.error("Frame capture error:", err);
      setCapturing(false);
    }
  };

  return (
    <div className="sensor-viewer">
      {/* ================= HEADER ================= */}
      <div className="viewer-header">
        <div>
          <h2>{selectedSensor}</h2>
          <span className="viewer-subtitle">{currentSensor.subtitle}</span>
        </div>

        <div className="viewer-actions">
          <button
            className={`capture-frame-btn ${capturing ? "capturing" : ""}`}
            onClick={handleCaptureFrame}
            title="Capture current sensor view for Detection pipeline"
          >
            <FaCamera className="capture-icon" />
            <span>{capturing ? "CAPTURING..." : "CAPTURE FRAME"}</span>
          </button>

          <div className="live-status">
            <span className="status-dot"></span>
            LIVE
          </div>
        </div>
      </div>

      {/* ================= LARGE SENSOR VIEW ================= */}
      <div className="viewer-content">
        <SensorTargetView
          selectedSensor={selectedSensor}
          onGlReady={onGlReady}
        />
      </div>

      {/* ================= SENSOR METRICS ================= */}
      <div className="sensor-metrics">
        {/* STATUS */}
        <div className="metric-item">
          <span className="metric-label">STATUS</span>
          <strong className="metric-value">
            {data?.status ? data.status.toUpperCase() : "ACTIVE"}
          </strong>
        </div>

        {/* FPS */}
        <div className="metric-item">
          <span className="metric-label">FPS</span>
          <strong className="metric-value">
            {data?.fps !== undefined ? data.fps : "60"}
          </strong>
        </div>

        {/* RANGE */}
        <div className="metric-item">
          <span className="metric-label">RANGE</span>
          <strong className="metric-value">
            {`${distanceVal.toFixed(2)} m`}
          </strong>
        </div>

        {/* LATENCY */}
        <div className="metric-item">
          <span className="metric-label">LATENCY</span>
          <strong className="metric-value">
            {data?.latency_ms !== undefined ? `${data.latency_ms} ms` : "12 ms"}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default SensorViewer;