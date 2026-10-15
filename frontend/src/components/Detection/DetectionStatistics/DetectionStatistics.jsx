
import "./DetectionStatistics.css";
import {
  FaSatellite,
  FaBullseye,
  FaClock,
  FaTachometerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";

function DetectionStatistics() {
  const { capturedFrame, detectionResult, isDetecting, detectionError } = useSensor();

  const detections = Array.isArray(detectionResult?.detections)
    ? detectionResult.detections
    : [];

  const hasDetections = detectionResult?.detected && detections.length > 0;

  let statusText = "Awaiting Input";
  let statusIcon = <FaClock />;
  let statusColor = "#FFC107";

  if (isDetecting) {
    statusText = "Processing...";
    statusIcon = <FaSpinner className="spinner-icon" />;
    statusColor = "#FFC107";
  } else if (detectionError) {
    statusText = "Inference Failed";
    statusIcon = <FaTimesCircle />;
    statusColor = "#F44336";
  } else if (detectionResult) {
    if (hasDetections) {
      statusText = "Target Detected";
      statusIcon = <FaCheckCircle />;
      statusColor = "#4CAF50";
    } else {
      statusText = "Target Absent";
      statusIcon = <FaTimesCircle />;
      statusColor = "#F44336";
    }
  } else if (capturedFrame) {
    statusText = "Frame Ready";
    statusIcon = <FaCheckCircle />;
    statusColor = "#FFC107";
  }

  // Use the sensor associated with the captured frame.
  const sensorName =
    capturedFrame?.selectedSensor ??
    capturedFrame?.sensor ??
    "--";

  // Number of valid detected targets
  const detectionsCount = detectionResult ? String(detections.length) : "--";

  // Calculate average confidence from genuine YOLO detections
  const avgConfidence = detections.length
    ? `${(
        (detections.reduce(
          (sum, det) => sum + (Number(det.confidence) || 0),
          0
        ) / detections.length) * 100
      ).toFixed(1)}%`
    : "--";

  // Distance requires a validated pose/depth estimation model
  const distance = "N/A";

  // Display mission time only when it is available.
  const acquisitionTime =
    capturedFrame?.missionTime != null
      ? `T+${capturedFrame.missionTime}s`
      : "--";

  const stats = [
    {
      title: "Input Sensor",
      value: sensorName,
      icon: <FaSatellite />,
    },
    {
      title: "Objects Detected",
      value: detectionsCount,
      icon: <FaBullseye />,
    },
    {
      title: "Est. Distance",
      value: distance,
      icon: <FaBullseye />,
    },
    {
      title: "Average Confidence",
      value: avgConfidence,
      icon: <FaTachometerAlt />,
    },
    {
      title: "Acquisition",
      value: acquisitionTime,
      icon: <FaClock />,
    },
    {
      title: "Status",
      value: statusText,
      icon: statusIcon,
      color: statusColor,
    },
  ];

  return (
    <div className="detection-statistics">
      <h3>Detection Statistics</h3>

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <div
              className="stat-icon"
              style={
                item.color
                  ? { color: item.color }
                  : undefined
              }
            >
              {item.icon}
            </div>

            <div>
              <span>{item.title}</span>
              <h2>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetectionStatistics;
