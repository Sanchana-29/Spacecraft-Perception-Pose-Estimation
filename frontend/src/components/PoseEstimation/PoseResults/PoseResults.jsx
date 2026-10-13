import "./PoseResults.css";

import {
  FaMapMarkerAlt,
  FaCompass,
  FaCheckCircle,
} from "react-icons/fa";

function PoseResults() {

  const results = [
    {
      title: "Position X",
      value: "12.45 m",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Position Y",
      value: "-3.21 m",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Position Z",
      value: "8.67 m",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Roll",
      value: "14.2 °",
      icon: <FaCompass />,
    },
    {
      title: "Pitch",
      value: "-8.4 °",
      icon: <FaCompass />,
    },
    {
      title: "Yaw",
      value: "105.6 °",
      icon: <FaCompass />,
    },
    {
      title: "Confidence",
      value: "96.4 %",
      icon: <FaCheckCircle style={{ color: "#4CAF50" }} />,
    },
  ];

  return (

    <div className="pose-results">

      <h3>Pose Results</h3>

      <div className="results-grid">

        {results.map((item,index)=>(

          <div className="result-card" key={index}>

            <div className="result-icon">

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

export default PoseResults;