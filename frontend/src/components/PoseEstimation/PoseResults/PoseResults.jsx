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
      value: "-- m",
      icon: <FaMapMarkerAlt />,
    },

    {
      title: "Position Y",
      value: "-- m",
      icon: <FaMapMarkerAlt />,
    },

    {
      title: "Position Z",
      value: "-- m",
      icon: <FaMapMarkerAlt />,
    },

    {
      title: "Roll",
      value: "-- °",
      icon: <FaCompass />,
    },

    {
      title: "Pitch",
      value: "-- °",
      icon: <FaCompass />,
    },

    {
      title: "Yaw",
      value: "-- °",
      icon: <FaCompass />,
    },

    {
      title: "Confidence",
      value: "-- %",
      icon: <FaCheckCircle />,
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