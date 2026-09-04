import "./LiveMetrics.css";

import {
  FaRuler,
  FaTachometerAlt,
  FaCompass,
  FaSatellite,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

function LiveMetrics() {

  const metrics = [

    {
      title: "Distance",
      value: "-- m",
      icon: <FaRuler />,
    },

    {
      title: "Velocity",
      value: "-- m/s",
      icon: <FaTachometerAlt />,
    },

    {
      title: "Attitude",
      value: "-- °",
      icon: <FaCompass />,
    },

    {
      title: "Tracking",
      value: "LOCKED",
      icon: <FaSatellite />,
    },

    {
      title: "Confidence",
      value: "-- %",
      icon: <FaCheckCircle />,
    },

    {
      title: "Latency",
      value: "-- ms",
      icon: <FaClock />,
    },

  ];

  return (

    <div className="live-metrics">

      {metrics.map((item,index)=>(

        <div className="metric-card" key={index}>

          <div className="metric-icon">
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

export default LiveMetrics;