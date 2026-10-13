import "./DetectionStatistics.css";
import {
  FaSatellite,
  FaBullseye,
  FaClock,
  FaTachometerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner
} from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";

function DetectionStatistics() {
  const { capturedFrame, detectionResult, isDetecting } = useSensor();

  let statusText = "Awaiting Input";
  let statusIcon = <FaClock />;
  
  if (isDetecting) {
    statusText = "Processing...";
    statusIcon = <FaSpinner className="spinner-icon" />;
  } else if (detectionResult) {
    if (detectionResult.detected) {
      statusText = "Target Detected";
      statusIcon = <FaCheckCircle style={{ color: "#4CAF50" }} />;
    } else {
      statusText = "Target Absent";
      statusIcon = <FaTimesCircle style={{ color: "#F44336" }} />;
    }
  } else if (capturedFrame) {
    statusText = "Frame Ready";
    statusIcon = <FaCheckCircle style={{ color: "#FFC107" }} />;
  }

  const stats = [
    {
      title: "Input Sensor",
      value: "RGB-D",
      icon: <FaSatellite />,
    },
    {
      title: "Est. Distance",
      value: "12.4 m",
      icon: <FaBullseye />,
    },
    {
      title: "Confidence",
      value: "98.5%",
      icon: <FaTachometerAlt />,
    },
    {
      title: "Acquisition",
      value: "T+145s",
      icon: <FaClock />,
    },
    {
      title: "Status",
      value: "Target Detected",
      icon: <FaCheckCircle style={{ color: "#4CAF50" }} />,
    },
  ];

  return (
    <div className="detection-statistics">
      <h3>Detection Statistics</h3>

      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">{item.icon}</div>

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