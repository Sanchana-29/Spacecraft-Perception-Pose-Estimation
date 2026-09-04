import "./DetectionStatistics.css";

import {
  FaSatellite,
  FaBullseye,
  FaClock,
  FaTachometerAlt,
  FaCheckCircle,
} from "react-icons/fa";

function DetectionStatistics() {

  const stats = [
    {
      title: "Objects",
      value: "0",
      icon: <FaSatellite />,
    },
    {
      title: "Tracking",
      value: "0",
      icon: <FaBullseye />,
    },
    {
      title: "FPS",
      value: "60",
      icon: <FaTachometerAlt />,
    },
    {
      title: "Inference",
      value: "-- ms",
      icon: <FaClock />,
    },
    {
      title: "Status",
      value: "Ready",
      icon: <FaCheckCircle />,
    },
  ];

  return (
    <div className="detection-statistics">

      <h3>Detection Statistics</h3>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <div className="stat-card" key={index}>

            <div className="stat-icon">
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