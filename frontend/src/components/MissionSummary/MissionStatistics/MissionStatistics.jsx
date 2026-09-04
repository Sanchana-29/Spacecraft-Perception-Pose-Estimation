import "./MissionStatistics.css";

import {
  FaSatellite,
  FaBullseye,
  FaCrosshairs,
  FaCube,
  FaTachometerAlt,
  FaClock,
} from "react-icons/fa";

function MissionStatistics() {

  const stats = [

    {
      title: "Objects Detected",
      value: "0",
      icon: <FaSatellite />,
    },

    {
      title: "Target Selected",
      value: "SAT-001",
      icon: <FaBullseye />,
    },

    {
      title: "Detection Accuracy",
      value: "-- %",
      icon: <FaCrosshairs />,
    },

    {
      title: "Pose Accuracy",
      value: "-- %",
      icon: <FaCube />,
    },

    {
      title: "Average FPS",
      value: "60",
      icon: <FaTachometerAlt />,
    },

    {
      title: "Mission Duration",
      value: "00:00:00",
      icon: <FaClock />,
    },

  ];

  return (

    <div className="mission-statistics">

      {stats.map((item,index)=>(

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

  );

}

export default MissionStatistics;