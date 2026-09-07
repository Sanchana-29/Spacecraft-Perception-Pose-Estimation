import "./DetectionStatistics.css";
import {
  FaSatellite,
  FaBullseye,
  FaClock,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useSensor } from "../../../context/SensorContext";

function DetectionStatistics() {
  const { capturedFrame } = useSensor();

  const stats = [
    {
      title: "Input Sensor",
      value: capturedFrame ? capturedFrame.selectedSensor.replace(" Camera", "") : "None",
      icon: <FaSatellite />,
    },
    {
      title: "Est. Distance",
      value: capturedFrame ? `${capturedFrame.distance} m` : "-- m",
      icon: <FaBullseye />,
    },
    {
      title: "FPS",
      value: capturedFrame ? capturedFrame.fps || "60" : "60",
      icon: <FaTachometerAlt />,
    },
    {
      title: "Acquisition",
      value: capturedFrame ? `T+${capturedFrame.missionTime}s` : "--",
      icon: <FaClock />,
    },
    {
      title: "Status",
      value: capturedFrame ? "Frame Ready" : "Awaiting Input",
      icon: <FaCheckCircle />,
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